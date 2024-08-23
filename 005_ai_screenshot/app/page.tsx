"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { MdAddCircle, MdDelete, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import {
  createFormatterBackend,
  createExtractionBackend,
  deleteFormatterBackend,
  loadDbExtractions,
  loadFormatters,
  deleteExtractionBackend,
} from "./actions";
import { GridLoader } from "react-spinners";
import { Extraction, Formatter } from "@prisma/client";
import Popup from "reactjs-popup";
import Modal from "react-modal";
import { userAgent } from "next/server";
import { useSessionUserStore } from "./auth/store";
import { useRouter } from "next/navigation";
import { createHash } from "crypto";

export default function Home() {
  const router = useRouter();
  const { user } = useSessionUserStore();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [newField, setNewField] = useState("");
  const [formatterName, setFormatterName] = useState("");
  const [formatters, setFormatters] = useState<Formatter[]>([]);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [currentFormatter, setCurrentFormatter] = useState<Formatter | null>(
    null
  );
  const [currentExtractions, setCurrentExtractions] = useState<Extraction[]>(
    []
  );
  const [isExtracting, setIsExtracting] = useState(false);

  const fieldNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && !user.username) {
      router.push("/auth/login");
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        const loadedFormatters = await loadFormatters();
        setFormatters(loadedFormatters);
      } catch (error) {
        toast.error("Failed to load formatters.");
      }
      loadFormatters();
    };
    load();
  }, []);

  useEffect(() => {
    const match = formatters.find(
      (formatter) => formatter.name === formatterName
    );
    setCurrentFormatter(match || null);
  }, [formatterName]);

  useEffect(() => {
    if (currentFormatter) {
      loadExtractions();
    }
  }, [currentFormatter]);

  async function addExtraction() {}

  async function deleteExtraction(extraction: Extraction) {
    try {
      await deleteExtractionBackend(extraction.id);
      setCurrentExtractions(
        currentExtractions.filter((e) => e.id !== extraction.id)
      );
      toast.success("Extraction deleted.");
    } catch (error) {
      toast.error("Failed to delete extraction.");
    }
  }

  async function deleteFormatter() {
    if (currentFormatter) {
      try {
        await deleteFormatterBackend(currentFormatter.id);
        setFormatters(
          formatters.filter((formatter) => formatter.id !== currentFormatter.id)
        );
        setCurrentFormatter(null);
        toast.success(`Formatter ${currentFormatter.name} deleted.`);
      } catch (error) {
        toast.error("Failed to delete formatter.");
      }
    }
  }

  async function removeField(fieldName: string) {
    setFieldNames(fieldNames.filter((name) => name !== fieldName));
  }

  async function loadExtractions() {
    if (currentFormatter) {
      const extractions = await loadDbExtractions(currentFormatter.id);
      setCurrentExtractions(extractions);
    }
  }

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        if (item.types.includes("image/png")) {
          const blob = await item.getType("image/png");

          const url = URL.createObjectURL(blob);
          setBackgroundImage(url);

          if (currentFormatter) {
            try {
              const formData = new FormData();
              formData.append("image", blob);
              setIsExtracting(true);
              const extraction = await createExtractionBackend(
                currentFormatter,
                formData
              );
              setCurrentExtractions([...currentExtractions, extraction]);
              setIsExtracting(false);
              toast.success("Extraction created.");
              return;
            } catch (error) {
              setIsExtracting(false);
              toast.error("Failed to create extraction.");
              return;
            }
          }
          toast.error("No formatter selected.");
          return;
        }
      }
      toast.error("No image found in clipboard.");
    } catch (error) {
      toast.error("Failed to read clipboard.");
    }
  };

  async function createFormatter() {
    setCreateModalIsOpen(false);
    if (user) {
      const formatter = await createFormatterBackend(
        user.id,
        formatterName,
        fieldNames
      );
      setFormatters([...formatters, formatter]);
      setCurrentFormatter(formatter);
      toast.success(`Formatter ${formatterName} created or updated.`);
    }
  }

  function addFieldName() {
    if (newField) {
      setFieldNames([...fieldNames, newField]);
      setNewField("");
      if (fieldNameInputRef?.current) {
        fieldNameInputRef.current.focus();
      }
    }
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex justify-center">
        <GridLoader className="my-auto" />
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col justify-center gap-8">
      <Modal
        isOpen={createModalIsOpen}
        onRequestClose={() => setCreateModalIsOpen(false)}
      >
        <div className="flex flex-col gap-2 my-auto bg-background h-full">
          <h1>New Formatter</h1>
          <input
            type="text"
            className="w-96"
            placeholder="Formatter Name"
            value={formatterName}
            onChange={(e) => {
              setFormatterName(e.target.value);
            }}
          />
          <div className={"pb-8 " + (!formatterName && "text-red-500")}>
            Formatter name is required.
          </div>
          <h3>Extraction Fields</h3>
          <div className="flex">
            <input
              className="w-96"
              type="text"
              placeholder="New Field"
              ref={fieldNameInputRef}
              value={newField}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\s+/g, "");
                setNewField(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addFieldName();
                }
              }}
            />
            <MdAddCircle className="text-primary -ml-10 my-auto text-4xl cursor-pointer hover:bg-background-dark rounded hover:text-primary-dark" />
          </div>
          <div className="flex flex-wrap gap-2">
            {fieldNames.map((fieldName, index) => (
              <div key={index} className="flex w-56">
                <div className="bg-background-dark w-full p-2 rounded">
                  {fieldName}
                </div>
                <MdDelete
                  className="text-red-500 -ml-9 cursor-pointer rounded my-auto text-4xl hover:bg-background-dark hover:text-red-600"
                  onClick={(e) => {
                    removeField(fieldName);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="h-full"></div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                createFormatter();
              }}
              disabled={!formatterName}
            >
              Save
            </button>
            <button
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                setCreateModalIsOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <div className="flex mx-auto">
        <input
          className="w-96"
          type="text"
          placeholder="Formatter Name"
          value={formatterName}
          onChange={(e) => {
            setFormatterName(e.target.value);
          }}
        />
        <MdSearch className="text-primary my-auto text-4xl -ml-10" />
      </div>
      <div className="flex gap-2 mx-auto">
        <button
          disabled={
            !formatters.find((formatter) => formatter.name === formatterName)
          }
          className="bg-red-500 hover:bg-red-600"
          onClick={deleteFormatter}
        >
          Delete Formatter
        </button>
        <button onClick={() => setCreateModalIsOpen(true)}>
          {currentFormatter ? "Update" : "Create"} Formatter
        </button>
      </div>
      <div className="flex gap-4 mx-auto">
        {isExtracting ? (
          <GridLoader className="my-auto" />
        ) : (
          <div
            className={`my-auto w-96 h-40 flex gap-2 flex-col text-primary border border-border justify-center cursor-pointer hover:bg-background-dark ${
              backgroundImage ? "bg-cover bg-center" : ""
            }`}
            onClick={handlePaste}
            style={{
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : "none",
            }}
          >
            {!backgroundImage && (
              <>
                <FaPlusCircle className="mx-auto text-3xl" />
                <div className="mx-auto">Click to paste</div>
              </>
            )}
          </div>
        )}
      </div>

      <h3 className="w-full text-center">
        {currentExtractions.length} Extractions
      </h3>
      <div className="w-full flex justify-center gap-2">
        <button
          className=""
          onClick={(e) => {
            e.preventDefault();
            const csv = currentExtractions
              .map((extraction) => {
                return currentFormatter?.fields
                  .map((fieldName) => {
                    return (extraction.data as any)[fieldName];
                  })
                  .join(",");
              })
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download =
              formatterName +
              "-" +
              new Date().toISOString() +
              "(" +
              currentExtractions.length +
              " Extractions)" +
              ".csv";
            a.click();
          }}
        >
          Export CSV
        </button>
        <button className="">Export JSON</button>
      </div>
      <table className="mx-auto mb-20">
        <tr className="">
          {currentFormatter?.fields.map((fieldName, index) => (
            <th key={index} className="px-2">
              {fieldName}
            </th>
          ))}
        </tr>
        {currentExtractions.toReversed().map((extraction, extractionIndex) => (
          <tr key={extractionIndex} className="border-b border-border">
            {currentFormatter?.fields.map((fieldName, fieldIndex) => (
              <td key={fieldIndex} className="px-2">
                {(extraction.data as any)[fieldName]}{" "}
              </td>
            ))}
            <td>
              <MdDelete
                className="text-accent hover-text-accent-dark cursor-pointer rounded bg-red-500 hover:bg-red-600"
                onClick={(e) => deleteExtraction(extraction)}
              />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
