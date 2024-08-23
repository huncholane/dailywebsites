"use client";
import { SketchPicker } from "react-color";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import slugify from "slugify";
import { Theme, toast } from "react-toastify";
import { Theme as ThemeType } from "@prisma/client";
import { PacmanLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const hexToRgba = (hex: string, opacity: number) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function Home() {
  const [themeName, setThemeName] = useState("");
  const [themeSlug, setThemeSlug] = useState("");
  const [primary, setPrimary] = useState("");
  const [primaryLight, setPrimaryLight] = useState("");
  const [primaryDark, setPrimaryDark] = useState("");
  const [secondary, setSecondary] = useState("");
  const [secondaryLight, setSecondaryLight] = useState("");
  const [secondaryDark, setSecondaryDark] = useState("");
  const [accent, setAccent] = useState("");
  const [accentLight, setAccentLight] = useState("");
  const [accentDark, setAccentDark] = useState("");
  const [background, setBackground] = useState("");
  const [backgroundLight, setBackgroundLight] = useState("");
  const [backgroundDark, setBackgroundDark] = useState("");
  const [text, setText] = useState("");
  const [textLight, setTextLight] = useState("");
  const [textDark, setTextDark] = useState("");
  const [border, setBorder] = useState("");
  const [borderLight, setBorderLight] = useState("");
  const [borderDark, setBorderDark] = useState("");
  const [currentColor, setCurrentColor] = useState(primary);
  const [currentSetter, setCurrentSetter] = useState(() => setPrimary);
  const [themes, setThemes] = useState<ThemeType[]>([]);
  const [generateDescription, setGenerateDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const compileTheme = () => {
    return {
      name: themeName,
      slug: themeSlug,
      primary,
      primaryLight,
      primaryDark,
      secondary,
      secondaryLight,
      secondaryDark,
      accent,
      accentLight,
      accentDark,
      background,
      backgroundLight,
      backgroundDark,
      text,
      textLight,
      textDark,
      border,
      borderLight,
      borderDark,
    } as ThemeType;
  };

  const decompileTheme = (theme: ThemeType) => {
    setPrimary(theme.primary);
    setPrimaryLight(theme.primaryLight);
    setPrimaryDark(theme.primaryDark);
    setSecondary(theme.secondary);
    setSecondaryLight(theme.secondaryLight);
    setSecondaryDark(theme.secondaryDark);
    setAccent(theme.accent);
    setAccentLight(theme.accentLight);
    setAccentDark(theme.accentDark);
    setBackground(theme.background);
    setBackgroundLight(theme.backgroundLight);
    setBackgroundDark(theme.backgroundDark);
    setText(theme.text);
    setTextLight(theme.textLight);
    setTextDark(theme.textDark);
    setBorder(theme.border);
    setBorderLight(theme.borderLight);
    setBorderDark(theme.borderDark);
  };

  const saveTheme = async () => {
    const existingSlugs = themes.map((theme) => theme.slug);
    const data = compileTheme();
    if (existingSlugs.includes(data.slug)) {
      try {
        await axios.put(`/api/theme/${data.slug}`, data);
        toast.success("Theme updated successfully!");
      } catch (error) {
        toast.error("Failed to update theme.");
      }
    } else {
      try {
        await axios.post("/api/theme", data);
        toast.success("Theme created successfully!");
        themes.push(data);
      } catch (error) {
        toast.error("Failed to create theme.");
      }
    }
  };

  const generateTheme = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post("/api/generate", {
        description: themeName,
      });
      const generatedTheme = response.data;
      decompileTheme(generatedTheme);
      toast.success("Theme generated successfully!");
    } catch (error) {
      toast.error("Failed to generate theme.");
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    const getCSSColor = (color: string) => {
      return getComputedStyle(document.documentElement).getPropertyValue(color);
    };
    setPrimary(getCSSColor("--primary-color"));
    setPrimaryLight(getCSSColor("--primary-color-light"));
    setPrimaryDark(getCSSColor("--primary-color-dark"));
    setSecondary(getCSSColor("--secondary-color"));
    setSecondaryLight(getCSSColor("--secondary-color-light"));
    setSecondaryDark(getCSSColor("--secondary-color-dark"));
    setAccent(getCSSColor("--accent-color"));
    setAccentLight(getCSSColor("--accent-color-light"));
    setAccentDark(getCSSColor("--accent-color-dark"));
    setBackground(getCSSColor("--background-color"));
    setBackgroundLight(getCSSColor("--background-color-light"));
    setBackgroundDark(getCSSColor("--background-color-dark"));
    setText(getCSSColor("--text-color"));
    setTextLight(getCSSColor("--text-color-light"));
    setTextDark(getCSSColor("--text-color-dark"));
    setBorder(getCSSColor("--border-color"));
    setBorderLight(getCSSColor("--border-color-light"));
    setBorderDark(getCSSColor("--border-color-dark"));
    setCurrentColor(getCSSColor("--primary-color"));

    const fetchThemes = async () => {
      const response = await axios.get("/api/theme");
      setThemes(response.data);
    };
    fetchThemes();
  }, []);

  useEffect(() => {
    const slug = slugify(themeName, { lower: true, replacement: "_" });
    setThemeSlug(slug);
    const themeQuery = themes.find((theme) => theme.slug === slug);
    if (themeQuery) {
      decompileTheme(themeQuery);
    }
  }, [themeName]);

  const colorItem = (
    color: string,
    name: string,
    setter: SetStateAction<Dispatch<SetStateAction<string>>>
  ) => {
    return (
      <div
        className={
          "flex gap-3 p-1 rounded-md cursor-pointer" +
          (currentSetter === setter ? " border" : "")
        }
        style={{
          backgroundColor:
            currentSetter === setter ? hexToRgba(color, 0.4) : "transparent",
        }}
        onClick={() => {
          setCurrentSetter(() => setter);
          setCurrentColor(color);
        }}
      >
        <div
          className={"w-10 h-10 border-border border rounded-md"}
          style={{ backgroundColor: color }}
        ></div>
        <div className="font-bold my-auto">{name}</div>
        <div className="font-light my-auto">{color}</div>
      </div>
    );
  };

  const tailwindSnippet = `colors: {
  primary: "var(--primary-color)",
  "primary-light": "var(--primary-color-light)",
  "primary-dark": "var(--primary-color-dark)",
  secondary: "var(--secondary-color)",
  "secondary-light": "var(--secondary-color-light)",
  "secondary-dark": "var(--secondary-color-dark)",
  accent: "var(--accent-color)",
  "accent-light": "var(--accent-color-light)",
  "accent-dark": "var(--accent-color-dark)",
  background: "var(--background-color)",
  "background-light": "var(--background-color-light)",
  "background-dark": "var(--background-color-dark)",
  text: "var(--text-color)",
  "text-light": "var(--text-color-light)",
  "text-dark": "var(--text-color-dark)",
  border: "var(--border-color)",
  "border-light": "var(--border-color-light)",
  "border-dark": "var(--border-color-dark)",
},`;

  const cssSnippet = `:root {
  --primary-color: ${primary};
  --primary-color-light: ${primaryLight};
  --primary-color-dark: ${primaryDark};
  --secondary-color: ${secondary};
  --secondary-color-light: ${secondaryLight};
  --secondary-color-dark: ${secondaryDark};
  --accent-color: ${accent};
  --accent-color-light: ${accentLight};
  --accent-color-dark: ${accentDark};
  --background-color: ${background};
  --background-color-light: ${backgroundLight};
  --background-color-dark: ${backgroundDark};
  --text-color: ${text};
  --text-color-light: ${textLight};
  --text-color-dark: ${textDark};
  --border-color: ${border};
  --border-color-light: ${borderLight};
  --border-color-dark: ${borderDark};
}`;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 w-full">
        <div>
          <h1 className="font-bold text-xl">Edit Your Color Scheme</h1>
          <input
            type="text"
            className="text-primary border-primary border rounded-md p-2 w-full"
            placeholder="What do you want to call your color theme"
            onChange={(e) => {
              setThemeName(e.target.value);
            }}
            value={themeName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                saveTheme();
              }
            }}
          />
          <p className="mb-4">{themeSlug}</p>
          <textarea
            name="AI Prompt"
            id="ai-prompt"
            placeholder="Generate a theme with AI."
            className="border border-primary rounded-md p-2 w-full h-32"
            value={generateDescription}
            onChange={(e) => setGenerateDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                generateTheme();
              }
            }}
          ></textarea>
          <div className="flex justify-between w-full">
            {isGenerating ? (
              <PacmanLoader className="h-14 text-green-500" />
            ) : (
              <button
                className="w-28 h-14 my-auto bg-green-500 hover:bg-green-600 rounded-md text-accent"
                onClick={() => {
                  generateTheme();
                }}
              >
                Generate
              </button>
            )}
            <div className="flex justify-end gap-4">
              <button
                className="w-28 my-auto bg-primary h-14 rounded-md text-accent hover:bg-primary-dark"
                onClick={saveTheme}
              >
                Save
              </button>
              <button className="w-28 my-auto bg-red-500 h-14 rounded-md text-accent hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <SketchPicker
            className="mb-4"
            color={currentColor}
            onChangeComplete={(color) => {
              currentSetter(color.hex);
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {colorItem(primary, "Primary", setPrimary)}
        {colorItem(primaryLight, "Primary Light", setPrimaryLight)}
        {colorItem(primaryDark, "Primary Dark", setPrimaryDark)}
        {colorItem(secondary, "Secondary", setSecondary)}
        {colorItem(secondaryLight, "Secondary Light", setSecondaryLight)}
        {colorItem(secondaryDark, "Secondary Dark", setSecondaryDark)}
        {colorItem(accent, "Accent", setAccent)}
        {colorItem(accentLight, "Accent Light", setAccentLight)}
        {colorItem(accentDark, "Accent Dark", setAccentDark)}
        {colorItem(background, "Background", setBackground)}
        {colorItem(backgroundLight, "Background Light", setBackgroundLight)}
        {colorItem(backgroundDark, "Background Dark", setBackgroundDark)}
        {colorItem(text, "Text", setText)}
        {colorItem(textLight, "Text Light", setTextLight)}
        {colorItem(textDark, "Text Dark", setTextDark)}
        {colorItem(border, "Border", setBorder)}
        {colorItem(borderLight, "Border Light", setBorderLight)}
        {colorItem(borderDark, "Border Dark", setBorderDark)}
      </div>
      <div className="grid grid-cols-2 gap-4 p-3 my-4">
        <div
          className="h-full cursor-pointer"
          onClick={() => {
            toast("CSS snippet copied to clipboard!");
            navigator.clipboard.writeText(cssSnippet);
          }}
        >
          <h2 className="font-semibold text-lg">CSS Snippet</h2>
          <pre className="bg-neutral-900 p-3 rounded-md text-white">
            {cssSnippet}
          </pre>
        </div>
        <div
          className="h-full cursor-pointer"
          onClick={() => {
            toast("Tailwind snippet copied to clipboard!");
            navigator.clipboard.writeText(tailwindSnippet);
          }}
        >
          <h2 className="font-semibold text-lg">Tailwind Snippet</h2>
          <pre className="bg-neutral-900 p-3 rounded-md text-white">
            {tailwindSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
