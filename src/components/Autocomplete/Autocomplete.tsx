import React, { useCallback, useEffect, useRef, useState } from "react";
import { User } from "../../types/users";
import { AutocompleteSuggestions } from "../AutocompleteSuggestions/AutocompleteSuggestions";
import styles from "./Autocomplete.module.css";
import { useDebounce } from "../../hooks/useDebounce";
import { Input } from "../Input/Input";
import { requestData } from "../../utils/requestData";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

export const Autocomplete = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const focusedIndex = useRef(-1);
  const [error, setError] = useState(null);

  // using debounce technique to avoid unnecessary API calls
  const debouncedSearch = useDebounce(search, 100);

  const handleSelect = useCallback((user: User) => {
    setSearch(user.name);
    focusedIndex.current = -1;
    setIsExpanded(false);
  }, []);

  useEffect(() => {
    if (debouncedSearch.length > 0) {
      setIsLoading(true);

      requestData({
        url: `${import.meta.env.VITE_API_URL}/users`,
        useLocalData: !import.meta.env.VITE_API_URL,
        query: {
          search: debouncedSearch.toLowerCase(),
        },
      })
        .then((data: User[]) => {
          setUsers(data);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [debouncedSearch]);

  const handleInputFocus = useCallback(() => {
    setIsExpanded(true);
  }, []);

  // what I'm doing here is trying to make sure user is able to use arrows for navigation
  // within the list of suggestions
  // I know it's confusing a bit, but actually it's not that complicated
  // we just need to keep track of the focused item index using ref
  // and then use it to focus the next or previous item
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const focusedElement = document.activeElement;

      if (event.key === "ArrowDown") {
        event.preventDefault();

        // if the input is focused, move focus to the first suggestion
        if (listRef.current && focusedElement === inputRef.current) {
          focusedIndex.current = 0;
          const listOfItems = listRef.current.querySelectorAll("li");

          if (listOfItems[0]) {
            listOfItems[0].focus();
          }
          // if a suggestion is focused, move focus to the next suggestion
        } else if (listRef.current?.contains(focusedElement)) {
          const newFocusedIndex =
            focusedIndex.current === users.length - 1
              ? 0
              : focusedIndex.current + 1;
          focusedIndex.current = newFocusedIndex;
          const listOfItems = listRef.current.querySelectorAll("li");

          if (listOfItems[newFocusedIndex]) {
            listOfItems[newFocusedIndex].focus();
          }
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        // Move focus to the last suggestion or previous suggestion

        // if the input is focused, move focus to the last suggestion
        if (listRef.current && focusedElement === inputRef.current) {
          const listOfItems = listRef.current.querySelectorAll("li");

          if (listOfItems[users.length - 1]) {
            listOfItems[users.length - 1].focus();
          }
          //  if a suggestion is focused, move focus to the previous suggestion
        } else if (listRef.current?.contains(focusedElement)) {
          const newFocusedIndex =
            focusedIndex.current === 0
              ? users.length - 1
              : focusedIndex.current - 1;
          focusedIndex.current = newFocusedIndex;
          const listOfItems = listRef.current.querySelectorAll("li");

          if (listOfItems[newFocusedIndex]) {
            listOfItems[newFocusedIndex].focus();
          }
        }
      }
    },
    [users.length, focusedIndex],
  );

  const handleInputBlur = useCallback(() => {
    // Use setTimeout to allow clicking on the suggestion before hiding the list
    if (focusedIndex.current < 0) {
      setTimeout(() => setIsExpanded(false), 200);
    }
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      focusedIndex.current = -1;
    },
    [],
  );

  return (
    <div className={styles.wrapper} onKeyDown={handleKeyDown}>
      <label className={styles.label} htmlFor="cb1-input">
        Start typing a name (e.g. John)
      </label>

      <Input
        ref={inputRef}
        aria-autocomplete="list"
        aria-expanded={search.length > 0 ? "true" : "false"}
        id="cb1-input"
        role="combobox"
        type="search"
        value={search}
        className={styles.input}
        onChange={handleSearchChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />

      {isLoading && (
        <div className={styles.loadingSpinner}>
          <LoadingSpinner />
        </div>
      )}

      {search.length > 0 &&
        users.length > 0 &&
        isExpanded &&
        users[0]?.name !== search && (
          <AutocompleteSuggestions
            ref={listRef}
            users={users}
            onSelect={handleSelect}
            search={search}
          />
        )}

      {error && (
        <div onClick={() => setError(null)} className={styles.error}>
          {error}
          Click to remove
        </div>
      )}
    </div>
  );
};
