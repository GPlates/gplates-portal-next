"use client";

import React, { useEffect } from "react";

type GComboboxProps = {
  allListItems: string[];
  currentItem: string;
  setCurrentItem: (item: string) => void;
};

const GCombobox = ({ allListItems, currentItem, setCurrentItem }: GComboboxProps) => {
  const [listItems, setListItems] = React.useState<string[]>([]);
  const [showListFlag, setShowListFlag] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  /**
   * set initial value for the input element
   */
  useEffect(() => {
    if (inputRef.current && allListItems.length > 0 && inputRef.current.value == "") {
      inputRef.current.value = allListItems[0];
    }
  }, [allListItems]);

  /**
   *
   * @param e
   */
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length == 0) {
      setListItems(allListItems);
    } else {
      setListItems(
        listItems.filter((item) => {
          return item.startsWith(e.target.value);
        })
      );
    }
  };

  const onInputFocus = () => {
    setShowListFlag(true);
    setListItems(allListItems);
  };

  /**
   *
   * @param e
   */
  const onInputFocusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    //setShowListFlag(false);
    if (allListItems.includes(e.target.value)) {
      setCurrentItem(e.target.value);
    } else {
      e.target.value = currentItem;
    }
  };

  const handleItemOnClick = (item: string) => {
    setCurrentItem(item);
    if (inputRef.current) inputRef.current.value = item;
    //console.log(item);
    setShowListFlag(false);
  };

  return (
    <div>
      <div
        className={`dropback ${showListFlag ? "" : "hidden"}`}
        onClick={() => {
          setShowListFlag(false);
        }}
      ></div>
      <div className="gcombobox pid-select">
        <label
          htmlFor="item-input"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Root Plate ID
        </label>
        <input
          ref={inputRef}
          id="item-input"
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => onInputChange(e)}
          onFocus={() => onInputFocus()}
          onBlur={(e) => onInputFocusOut(e)}
          //value={currentItem}
          required
        />

        <div
          id="dropdown"
          className={`z-10 ${
            showListFlag ? "" : "hidden"
          } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {listItems.map((item, i) => {
              let fillColor = "none";
              if (item == currentItem) {
                fillColor = "#000000";
              }
              return (
                <li key={i} onClick={() => handleItemOnClick(item)}>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      fill={fillColor}
                      height="10px"
                      width="10px"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 490 490"
                      xmlSpace="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <polygon points="452.253,28.326 197.831,394.674 29.044,256.875 0,292.469 207.253,461.674 490,54.528 "></polygon>{" "}
                      </g>
                    </svg>
                    <span style={{ marginLeft: "5px" }}>{item}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GCombobox;
