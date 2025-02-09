import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { getGlobalData } from "../../lib/global";
import Image from "next/image";
import LoginButton from "./LoginButton";

export default function Header() {
  const globalData = getGlobalData();

  // const items = useCartStore((state) => state.items);
  // const itemCount = items.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-[var(--main-background)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="site home">
            <Image
              src={globalData.logo}
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
            <LoginButton />
            <Link href="/cart" className="relative" aria-label="site cart">
              <ShoppingCart className="h-6 w-6 text-[var(--main-color)]" />
              {/* {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )} */}
            </Link>

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
