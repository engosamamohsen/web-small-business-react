import {
  Facebook,
  Instagram,
  MessageCircle,
  Send,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black py-10 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 max-sm:flex-col">
          <p className="text-sm max-sm:hidden">جميع الحقوق محفوظة 2020</p>
          <div className="text-xl font-bold text-orange-500 sm:text-2xl">
            مطعمنا
          </div>
          <div className="flex gap-2">
            <a
              href="#"
              className="transform transition-all duration-300 ease-in-out hover:scale-125 hover:text-orange-500"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="transform transition-all duration-300 ease-in-out hover:scale-125 hover:text-orange-500"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="transform transition-all duration-300 ease-in-out hover:scale-125 hover:text-orange-500"
            >
              <MessageCircle size={20} />
            </a>
            <a
              href="#"
              className="transform transition-all duration-300 ease-in-out hover:scale-125 hover:text-orange-500"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="transform transition-all duration-300 ease-in-out hover:scale-125 hover:text-orange-500"
            >
              <Send size={20} />
            </a>
          </div>{" "}
          <p className="text-sm sm:hidden">جميع الحقوق محفوظة 2020</p>
        </div>
      </div>
    </footer>
  );
}
