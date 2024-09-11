import { Console } from "../../lib";

export default function getOpTypeFilter(response) {
  if (response.ok) {
    try {
      const data = [{ value: 0, label: "Todos" }];
      response.data.map((item) => {
        return data.push({
          value: item.id,
          label: item.typeName,
        });
      });
      return { data };
    } catch (e) {
      Console.errorParseResponse("/status/get");
      return { ...response, ok: false };
    }
  } else {
    return response;
  }
}
