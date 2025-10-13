// src/components/core/Header.jsx
import { Logo, SearchIcon, BellIcon } from "../common/Icons";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between whitespace-nowrap border-b border-white/10 bg-background-light/80 px-4 py-3 backdrop-blur-sm dark:bg-background-dark/80 sm:px-6 lg:px-10">
      <div className="flex items-center gap-4">
        <Logo className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Streamify
        </h2>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="hidden max-w-xs flex-1 md:block">
          <label className="relative text-gray-400 focus-within:text-gray-600 dark:text-gray-500 dark:focus-within:text-gray-400">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon />
            </div>
            <input
              className="block w-full rounded-full border-transparent bg-background-light/50 py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 ring-1 ring-inset ring-gray-200/50 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-background-dark/50 dark:text-white dark:placeholder-gray-400 dark:ring-white/10 dark:focus:bg-background-dark dark:focus:ring-primary"
              placeholder="Search"
            />
          </label>
        </div>
        <button className="rounded-full p-2 text-gray-600 hover:bg-gray-200/50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white">
          <BellIcon />
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark ring-primary/50"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1op8KLAiRAkffgvJdtn5Sn_i0cicayVQxJz7dxmiLo33aXO7WFK1Zi4PKlxh5n1rDjllqSEsIpVYj8-NnF09lCJM9A3YK0ErqmnkMVMexPOeu0SqE8fP8kZkVd_XvNXRimNxGSRRqb65vyCPjpFE8d97aVCDVkrb97HmEQMeAmdfjYRimrkzASZj8VD35Cd_UXrKqLzBr4I9kuxgdMHiWwR1ENAWu_yOJmuCpnL5c9-4RdItY2lKUicC76xyfsj97wcfNSK2JVA")`,
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;