const list = [
  {
    name: "necati nalbantoğlu",
  },
  {
    name: "john doe",
  },
  {
    name: "nerea mendez",
  },
  {
    name: "arnold gardner",
  },
  {
    name: "julia cano",
  },
  {
    name: "annika schulte",
  },
  {
    name: "justin harcourt",
  },
  {
    name: "noah bonnet",
  },
  {
    name: "eemil neva",
  },
  {
    name: "léonard arnaud",
  },
  {
    name: "leevi wiitala",
  },
  {
    name: "alma thomsen",
  },
  {
    name: "mia li",
  },
];

function addQueryToUrl(url: string, query: Record<string, string>): string {
  const urlObject = new URL(url);

  Object.entries(query).forEach(([key, value]) => {
    urlObject.searchParams.append(key, value);
  });

  return urlObject.toString();
}

export function requestData({
  url,
  useLocalData = false,
  query,
}: {
  url?: string;
  useLocalData?: boolean;
  query: Record<string, string>;
}) {
  if (useLocalData || !url) {
    return Promise.resolve(
      list.filter((item) => item.name.includes(query?.search || "")),
    );
  }

  return fetch(addQueryToUrl(url, query)).then((res) => res.json());
}
