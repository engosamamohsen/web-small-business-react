import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "./LoginButton";
import { getDefaultStore } from "jotai";
import { settingsDataAtom } from "@/lib/stores/settingsData";
import Cookies from "js-cookie";

export default function Header() {
  const store = getDefaultStore();
  const settings = store.get(settingsDataAtom);

  // const items = useCartStore((state) => state.items);
  // const itemCount = items.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-[var(--main-background)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="site home">
            <Image
              src={settings.logo}
              alt="site logo"
              width={100}
              height={50}
              quality={70}
              style={{ maxHeight: "50px", objectFit: "contain" }}
            />
          </Link>
          <div className="flex items-center gap-4">
            {/* <div className="hidden md:block relative">
              <SearchBar />
            </div> */}
            {Cookies.get("app_token") && (
              <Link href="/cart" className="relative" aria-label="site cart">
                <ShoppingCart className="h-5 w-5 text-[var(--second-font-color)]" />
              </Link>
            )}
            <LoginButton />

            {/* <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X size={24} className="text-orange-600" />
              ) : (
                <Menu className="text-orange-600" size={24} />
              )}
            </button> */}
          </div>
        </div>

        {/* Mobile Search */}
        {/* <div
          className={`md:hidden transition-all duration-300 ${
            isMenuOpen
              ? "max-h-20 opacity-100 mt-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="relative">
            <SearchBar />
          </div>
        </div> */}
      </div>
    </div>
  );
}
