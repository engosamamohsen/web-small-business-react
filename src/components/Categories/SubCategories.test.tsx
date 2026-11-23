import { afterEach, describe, expect, it, vi } from "vitest";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SubCategories from "./SubCategories";

// Style sheets and the slider are not needed here (the unit-test config has no PostCSS and no DOM)
vi.mock("./style.module.css", () => ({ default: {} }));
vi.mock("swiper/css", () => ({}));
vi.mock("swiper/css/free-mode", () => ({}));
vi.mock("swiper/css/scrollbar", () => ({}));
vi.mock("swiper/modules", () => ({ FreeMode: {}, Scrollbar: {} }));
vi.mock("swiper/react", () => ({
    Swiper: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    SwiperSlide: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("./CategorySwiper", () => ({ scrollToProducts: vi.fn() }));
vi.mock("@/lib/navigation", () => ({
    useSearchParams: () => new URLSearchParams(globalThis.window?.location?.search ?? ""),
    useRouter: () => ({}),
}));

type Sub = { id: number; name: string; slug?: string | null };
const list = (subs: Sub[]) => subs.map((s) => ({ icon: "", ...s })) as any;

/** A fake browser address bar: the URL the sub-category chip pushes. */
function fakeWindow(search = "") {
    const pushState = vi.fn();
    vi.stubGlobal("window", { location: { pathname: "/", search }, history: { pushState } });
    return pushState;
}

/** Every chip <button> in the element tree (the component is called directly: no DOM in the unit tests). */
function buttons(node: ReactNode, found: ReactElement<any>[] = []): ReactElement<any>[] {
    if (Array.isArray(node)) node.forEach((n) => buttons(n, found));
    else if (isValidElement(node)) {
        const element = node as ReactElement<any>;
        if (element.type === "button") found.push(element);
        buttons(element.props.children, found);
    }
    return found;
}

function clickChip(subs: Sub[], index: number) {
    const tree = (SubCategories as any)({ categories: list(subs) });
    buttons(tree)[index].props.onClick();
}

afterEach(() => vi.unstubAllGlobals());

// Clicking a sub-category with no slug crashed ("Cannot read properties of null (reading 'toString')"),
// the same bug as the category strip (QA 2026-11-23).
describe("the sub-category chips", () => {
    it("render sub-categories with a null, missing or empty slug", () => {
        const html = renderToStaticMarkup(
            <SubCategories categories={list([
                { id: 1, name: "Null slug", slug: null },
                { id: 2, name: "No slug" },
                { id: 3, name: "Empty slug", slug: "" },
                { id: 4, name: "With slug", slug: "cakes" },
            ])} />,
        );
        for (const name of ["Null slug", "No slug", "Empty slug", "With slug"]) {
            expect(html).toContain(name);
        }
    });

    it("select a sub-category with a null, missing or empty slug by its id, without crashing", () => {
        for (const slug of [null, undefined, ""]) {
            const pushState = fakeWindow("?category=7-pizza");
            expect(() => clickChip([{ id: 5, name: "Sub", slug }], 0)).not.toThrow();
            expect(pushState).toHaveBeenCalledWith({}, "", "/?category=7-pizza&page=1&sub_category=5");
        }
    });

    it("keep <id>-<slug> for a sub-category with a slug", () => {
        const pushState = fakeWindow();
        clickChip([{ id: 5, name: "Cakes", slug: "cakes" }], 0);
        expect(pushState).toHaveBeenCalledWith({}, "", "/?page=1&sub_category=5-cakes");
    });

    it("unselect on a second click when the link has a bare id or an old slug", () => {
        for (const search of ["?sub_category=5", "?sub_category=5-old-slug"]) {
            const pushState = fakeWindow(search);
            clickChip([{ id: 5, name: "Cakes", slug: "cakes" }], 0);
            expect(pushState).toHaveBeenCalledWith({}, "", "/?page=1");
        }
    });

    it("unselect the chosen sub-category on a second click, with or without a slug", () => {
        let pushState = fakeWindow("?sub_category=5");
        clickChip([{ id: 5, name: "Sub", slug: null }], 0);
        expect(pushState).toHaveBeenCalledWith({}, "", "/?page=1");

        pushState = fakeWindow("?sub_category=5-cakes");
        clickChip([{ id: 5, name: "Cakes", slug: "cakes" }], 0);
        expect(pushState).toHaveBeenCalledWith({}, "", "/?page=1");
    });
});

// A direct link (?sub_category=...) showed no sub-category selected: the server can't read the browser URL
// (QA 2026-11-23).
describe("the sub-category chips on a direct link (server HTML)", () => {
    const SUBS: Sub[] = [
        { id: 5, name: "Null slug", slug: null },
        { id: 6, name: "Empty slug", slug: "" },
        { id: 7, name: "With slug", slug: "cakes" },
    ];
    const active = (html: string) =>
        [...html.matchAll(/<button[^>]*class="([^"]*)"[^>]*>.*?<span[^>]*>([^<]+)<\/span>/g)]
            .filter((m) => m[1].includes("text-white"))
            .map((m) => m[2]);

    it("marks the linked sub-category, with or without a slug", () => {
        const cases: Array<[string, string]> = [["5", "Null slug"], ["6", "Empty slug"], ["7-cakes", "With slug"], ["7", "With slug"]];
        for (const [param, name] of cases) {
            const html = renderToStaticMarkup(<SubCategories categories={list(SUBS)} initialSubCategory={param} />);
            expect(active(html), param).toEqual([name]);
        }
        expect(active(renderToStaticMarkup(<SubCategories categories={list(SUBS)} />))).toEqual([]);
    });

    it("gives the browser the same first HTML as the server, so the selection survives hydration", () => {
        for (const param of ["5", "7-cakes", null]) {
            const server = renderToStaticMarkup(<SubCategories categories={list(SUBS)} initialSubCategory={param} />);
            fakeWindow(param ? `?sub_category=${param}` : "");
            const browser = renderToStaticMarkup(<SubCategories categories={list(SUBS)} initialSubCategory={param} />);
            vi.unstubAllGlobals();
            expect(browser, String(param)).toBe(server);
        }
    });
});
