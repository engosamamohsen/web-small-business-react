import React from "react";
import { InputText } from "primereact/inputtext";
import { Search } from "lucide-react";

function SearchBar() {
  return (
    <>
      <InputText
        type="search"
        placeholder="ابحث عن طبق..."
        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 md:w-48 lg:w-64"
      />
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
        size={20}
      />
    </>
  );
}

export default SearchBar;
