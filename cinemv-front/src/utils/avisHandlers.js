import { updateAvis, deleteAvis, updateNote, deleteNote } from "../services/api";

export const handleUpdateAvis = async (avisId, contenu, utilisateurId, filmId, refresh) => {
  const nouveauContenu = prompt("Modifier votre avis :", contenu);
  if (nouveauContenu) {
    await updateAvis(avisId, nouveauContenu, utilisateurId, filmId);
    if (refresh) await refresh();
  }
};

export const handleDeleteAvis = async (avisId, refresh) => {
  if (window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
    await deleteAvis(avisId);
    if (refresh) await refresh();
  }
};

export const handleUpdateNote = async (noteId, valeur, utilisateurId, filmId, refresh) => {
  const nouvelleValeur = prompt("Modifier votre note (entre 0 et 5) :", valeur);
  const parsedValeur = parseFloat(nouvelleValeur);
  if (!isNaN(parsedValeur) && parsedValeur >= 0 && parsedValeur <= 5) {
    await updateNote(noteId, parsedValeur, utilisateurId, String(filmId));
    if (refresh) await refresh();
  } else {
    alert("Veuillez entrer une valeur entre 0 et 5.");
  }
};

export const handleDeleteNote = async (noteId, refresh) => {
  if (window.confirm("Voulez-vous vraiment supprimer cette note ?")) {
    await deleteNote(noteId);
    if (refresh) await refresh();
  }
};
