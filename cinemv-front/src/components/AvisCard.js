import { Card, CardContent, CardMedia, IconButton, Typography, Rating, ListItemText } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";

function AvisCard({
  lien,
  imageSrc,
  titre,
  contenu,
  note,
  date,
  isOwner,
  onUpdateAvis,
  onDeleteAvis,
  onUpdateNote,
  onDeleteNote,
  layout = "card",
}) {
  const formattedDate = new Date(date).toLocaleDateString();

  return layout === "card" ? (
    <Card sx={{ display: "flex", alignItems: "center", p: 1 }}>
      <Link to={lien} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
        <CardMedia
          component="img"
          image={imageSrc}
          alt={titre}
          sx={{ width: 100 }}
        />
      </Link>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle1">{titre}</Typography>
        <Typography variant="body2" color="text.secondary">
          {contenu || "Aucun avis posté."}
        </Typography>
        {note !== null && (
          <>
            <Rating value={note} precision={0.5} readOnly size="small" sx={{ mb: 1 }} />
            {isOwner && (
              <>
                <IconButton size="small" onClick={onUpdateNote}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={onDeleteNote} color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </>
            )}
          </>
        )}
        {contenu && isOwner && (
          <>
            <IconButton size="small" onClick={onUpdateAvis}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onDeleteAvis} color="error">
              <Delete fontSize="small" />
            </IconButton>
          </>
        )}
        <Typography variant="caption">Posté le {formattedDate}</Typography>
      </CardContent>
    </Card>
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Link to={lien} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 16 }}>
        <img src={imageSrc} alt={titre} style={{ width: 50, height: 50, borderRadius: "50%" }} />
        <Typography fontWeight="bold">{titre}</Typography>
      </Link>
      <ListItemText
        primary={contenu || "Aucun avis posté."}
        secondary={`Posté le ${formattedDate}`}
      />
      {note !== null && (
        <Typography variant="body2" sx={{ marginLeft: 2 }}>
          Note : {note} / 5
        </Typography>
      )}
      {isOwner && (
        <>
          {contenu && (
            <>
              <IconButton onClick={onUpdateAvis}>
                <Edit />
              </IconButton>
              <IconButton onClick={onDeleteAvis} color="error">
                <Delete />
              </IconButton>
            </>
          )}
          {note !== null && (
            <>
              <IconButton onClick={onUpdateNote}>
                <Edit />
              </IconButton>
              <IconButton onClick={onDeleteNote} color="error">
                <Delete />
              </IconButton>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AvisCard;
