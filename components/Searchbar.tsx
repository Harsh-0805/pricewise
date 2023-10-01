"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { FormEvent, useState } from "react";

const isValidAmazonProductUrl = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.includes("amazon")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

const Searchbar = () => {
  const [SearchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidLink = isValidAmazonProductUrl(SearchPrompt);

    if (!isValidLink) {
      alert("Please enter a valid Amazon product link");
      return;
    }

    try {
      setIsloading(true);

      // Scrape the product page
      const product = await scrapeAndStoreProduct(SearchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <form
      action=""
      className="flex flex-wrap gap-4 mt-12"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={SearchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />
      <button
        type="submit"
        disabled={SearchPrompt === ""}
        className="searchbar-btn"
      >
        {isLoading ? "Loading..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
