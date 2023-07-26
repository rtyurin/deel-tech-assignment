import { User } from "../../types/users";
import React, { ForwardedRef } from "react";
import styles from "./AutocompleteSuggestions.module.css";
import { AutocompleteItem } from "../AutocompleteItem/AutocompleteItem";

type AutocompleteSuggestionsPropsT = {
  users: User[];
  onSelect: (user: User) => void;
  search: string;
};
export const AutocompleteSuggestions = React.forwardRef(
  (
    { users, onSelect, search }: AutocompleteSuggestionsPropsT,
    ref: ForwardedRef<HTMLUListElement>,
  ) => {
    return (
      <ul
        className={styles.list}
        ref={ref}
        role="listbox"
        aria-label="Autocomplete suggestions"
      >
        {users.map((user) => (
          <AutocompleteItem
            // use tabIndex to make the list item focusable
            // it may be better to use a button instead of a list item
            tabIndex={-1}
            // in this case names are unique but for production app it's better to use ids
            key={user.name}
            onSelect={onSelect}
            user={user}
            search={search}
          />
        ))}
      </ul>
    );
  },
);
