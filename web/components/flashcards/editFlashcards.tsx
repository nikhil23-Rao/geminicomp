import { User } from "@/types/auth/User";
import { Flashcard } from "@/types/flashcard/Flashcard";
import db from "@/utils/initDB";
import { addDoc, collection, doc, updateDoc } from "@firebase/firestore";
import { TextField, TextareaAutosize } from "@mui/material";
import { motion } from "framer-motion";

interface IProps {
  setModal: (i: boolean) => void;
  setFlashcards: (i: Array<Flashcard>) => void;
  flashcards: Array<Flashcard>;
  name: string;
  currentUser: User;
  chosenClass?: string;
  selectedUnits?: string[];
  editMode?: boolean;
  setdocid?: string;
  setName: (name: string) => void;
}

export const EditFlashcards = ({
  setModal,
  flashcards,
  name,
  setFlashcards,
  currentUser,
  chosenClass,
  selectedUnits,
  editMode = false,
  setName,
  setdocid,
}: IProps) => {
  return (
    <>
      <i
        className="fa fa-window-close fa-2x"
        style={{
          color: "red",
          position: "absolute",
          top: 50,
          right: 100,
          cursor: "pointer",
        }}
        onClick={() => {
          setModal(false);
          setFlashcards([]);
          setName("My New Set");
        }}
      ></i>
      <motion.div
        initial={{ opacity: 0, y: 300 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        animate={{ y: 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginBottom: 140,
        }}
      >
        <h1
          className="text-gradient-black"
          style={{ fontSize: "4vw", marginTop: 130, marginLeft: "-28%" }}
        >
          Review:{" "}
          <TextareaAutosize
            className="card-title"
            value={name.length <= 16 ? name : name.substring(0, 16) + "..."}
            style={{
              border: "none",
              outline: "none",
              resize: "none",
              width: "52vw",
              fontSize: "4vw",
              position: "absolute",
              height: 20,
              marginLeft: 20,
            }}
            maxRows={1}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></TextareaAutosize>
        </h1>
        {flashcards.map((card) => (
          <>
            <div className="card-main" style={{ marginTop: 80 }}>
              <div className="card-img" style={{ maxWidth: 50 }}>
                <div
                  style={{ backgroundColor: "#000", height: "100%" }}
                  className="gradientbg"
                ></div>
              </div>
              <div className="card-content">
                Term:{" "}
                <TextareaAutosize
                  className="card-title"
                  value={card.term}
                  style={{
                    border: "none",
                    outline: "none",
                    resize: "none",
                    width: "35vw",
                  }}
                  onChange={(e) => {
                    let oldFlashcards = [...flashcards];
                    const target: any = oldFlashcards.find(
                      (c) => c.term === card.term,
                    );

                    const newCard = {
                      term: e.target.value,
                      definition: card.definition,
                    };

                    Object.assign(target, newCard);

                    setFlashcards([...oldFlashcards] as [Flashcard]);
                  }}
                ></TextareaAutosize>
                Definition:{" "}
                <TextareaAutosize
                  className="card-description"
                  value={card.definition}
                  style={{
                    border: "none",
                    outline: "none",
                    resize: "none",
                    width: "35vw",
                    height: 20,
                  }}
                  onChange={(e) => {
                    let oldFlashcards = [...flashcards];
                    const target: any = oldFlashcards.find(
                      (c) => c.definition === card.definition,
                    );

                    const newCard = {
                      definition: e.target.value,
                      term: card.term,
                    };

                    Object.assign(target, newCard);

                    setFlashcards([...oldFlashcards] as any);
                  }}
                ></TextareaAutosize>
                <div className="card-date">
                  <p className="date">Generated by Vertex</p>
                </div>
              </div>
            </div>
          </>
        ))}
        {editMode && (
          <div
            style={{ marginTop: 20, cursor: "pointer" }}
            className="text-gradient-black"
          >
            <i className="fa fa-arrow-down"></i> Generate More with AI
          </div>
        )}
        <div
          style={{ marginTop: 20, cursor: "pointer" }}
          className="text-gradient-black"
          onClick={() => {
            setFlashcards([
              ...flashcards,
              { term: "New Term", definition: "add definition" },
            ]);
          }}
        >
          <i className="fa fa-plus-circle"></i> Add Own Card
        </div>
        <button
          className={"primary-effect"}
          style={{
            width: 400,
            borderRadius: 200,
            bottom: 50,
            cursor: "pointer",
            position: "fixed",
          }}
          onClick={async () => {
            if (!editMode) {
              const docid = await addDoc(collection(db, "flashcards"), {
                createdById: currentUser?.id,
                createdByDocId: currentUser?.docid,
                flashcardSet: flashcards,
                cardsetName: name,
                class: chosenClass,
                units: selectedUnits,
                seed: `https://api.dicebear.com/8.x/identicon/svg?seed=${Math.floor(
                  Math.random() * 1000000,
                ).toString()}`,
              });
              await updateDoc(doc(db, "flashcards", docid.id), {
                docid: docid.id,
              });

              setModal(false);
              setFlashcards([]);
            } else {
              await updateDoc(doc(db, "flashcards", setdocid as string), {
                flashcardSet: flashcards,
                cardsetName: name,
              });
              setModal(false);
              setFlashcards([]);
            }

            // firebase save
          }}
        >
          <span
            style={{
              cursor: "pointer",
            }}
          >
            Save
          </span>
        </button>
      </motion.div>
    </>
  );
};
