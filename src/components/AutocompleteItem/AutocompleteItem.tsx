import styles from "./AutocompleteItem.module.css";
import { User } from "../../types/users";
import React, { useCallback, useRef } from "react";

type AutocompleteItemPropsT = {
  onSelect: (user: User) => void;
  user: User;
  search: string;
  tabIndex?: number;
};
export const AutocompleteItem = ({
  onSelect,
  user,
  search,
  tabIndex,
}: AutocompleteItemPropsT) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const renderName = useCallback(() => {
    if (!search) {
      return user.name;
    }
    const regex = new RegExp(`(${search})`, "gi");
    const parts = user.name.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part,
    );
  }, [search, user.name]);

  const handleTabKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLLIElement>) => {
      if (event.key === "Enter") {
        const focusedElement = document.activeElement;
        if (focusedElement === itemRef.current) {
          onSelect(user);
        }
      }
    },
    [onSelect, user],
  );

  const handleClick = useCallback(() => {
    onSelect(user);
  }, [onSelect, user]);

  return (
    <li
      ref={itemRef}
      tabIndex={tabIndex}
      onClick={handleClick}
      onKeyUp={handleTabKeyPress}
      role="option"
      className={styles.listItem}
      aria-selected={search === user.name}
    >
      {renderName()}
    </li>
  );
};
