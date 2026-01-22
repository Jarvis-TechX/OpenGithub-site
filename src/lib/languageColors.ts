// Language colors based on GitHub's linguist
// https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

export const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  C: "#555555",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Scala: "#c22d40",
  Shell: "#89e051",
  PowerShell: "#012456",
  Objective_C: "#438eff",
  R: "#198CE7",
  Perl: "#0298c3",
  Haskell: "#5e5086",
  Lua: "#000080",
  Clojure: "#db5855",
  Elixir: "#6e4a7e",
  Dart: "#00B4AB",
  Vim_script: "#199f4b",
  Emacs_Lisp: "#c065db",
  Julia: "#a270ba",
  Crystal: "#000100",
  Erlang: "#B83998",
  "F#": "#b845fc",
  OCaml: "#3be133",
  Groovy: "#4298b8",
  Elm: "#60B5CC",
  PureScript: "#1D222D",
  Vue: "#41b883",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Less: "#1d365d",
  Stylus: "#ff6347",
  CoffeeScript: "#244776",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  YAML: "#cb171e",
  JSON: "#292929",
  XML: "#0060ac",
  Markdown: "#083fa1",
  TeX: "#3D6117",
  Jupyter_Notebook: "#DA5B0B",
  Hack: "#878787",
  Solidity: "#AA6746",
  Zig: "#ec915c",
  Nim: "#ffc200",
  V: "#4f87c4",
  WebAssembly: "#04133b",
  ReasonML: "#ff5847",
};

export function getLanguageColor(language: string | null | undefined): string {
  if (!language) return "#8c959f"; // default muted color

  // Try exact match first
  if (languageColors[language]) {
    return languageColors[language];
  }

  // Try case-insensitive match
  const normalizedLanguage = language.toLowerCase();
  const matchedKey = Object.keys(languageColors).find(
    (key) => key.toLowerCase() === normalizedLanguage
  );

  if (matchedKey) {
    return languageColors[matchedKey];
  }

  // Try partial match (e.g., "Objective-C" matches "Objective_C")
  const partialMatchKey = Object.keys(languageColors).find(
    (key) => key.toLowerCase().replace(/[_\s-]/g, "") === normalizedLanguage.replace(/[_\s-]/g, "")
  );

  if (partialMatchKey) {
    return languageColors[partialMatchKey];
  }

  // Return default color
  return "#8c959f";
}
