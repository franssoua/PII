import { Card, CardMedia, IconButton, Typography, Rating } from "@mui/material";
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
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 260,
        width: 300,
        margin: 1,
        p: 2,
        boxShadow: 3,
      }}
    >
      <Link
        to={lien}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          textDecoration: "none",
          color: "inherit",
          marginBottom: 8,
        }}
      >
        <CardMedia
          component="img"
          image={imageSrc}
          alt={titre}
          sx={{ width: 80, height: 120, objectFit: "cover", borderRadius: 1 }}
        />
        <Typography variant="h6" fontWeight="bold">
          {titre}
        </Typography>
      </Link>

      {/* Avis */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>Avis :</strong> {contenu || "Aucun avis"}
        </Typography>
        {contenu && isOwner && (
          <span>
            <IconButton size="small" onClick={onUpdateAvis}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onDeleteAvis} color="error">
              <Delete fontSize="small" />
            </IconButton>
          </span>
        )}
      </div>

      {/* Note */}
      {note !== null && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "inline" }}
            >
              <strong>Note :</strong>
            </Typography>
            <Rating
              value={note}
              precision={0.5}
              readOnly
              size="small"
              sx={{ ml: 1, verticalAlign: "middle" }}
            />
          </span>
          {isOwner && (
            <span>
              <IconButton size="small" onClick={onUpdateNote}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onDeleteNote} color="error">
                <Delete fontSize="small" />
              </IconButton>
            </span>
          )}
        </div>
      )}

      <Typography variant="caption">Posté le {formattedDate}</Typography>
    </Card>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        gap: "1rem",
        position: "relative",
      }}
    >
      <div
        style={{ display: "flex", gap: "1rem", alignItems: "center", flex: 1 }}
      >
        <Link
          to={lien}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <img
            src={imageSrc}
            alt={titre}
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
          <Typography fontWeight="bold">{titre}</Typography>
        </Link>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            justifyContent: "center",
          }}
        >
          {/* Avis + icônes */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Typography>
              <strong>Avis :</strong> {contenu || "Aucun avis posté."}
            </Typography>
            {isOwner && contenu && (
              <>
                <IconButton size="small" onClick={onUpdateAvis}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={onDeleteAvis} color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </>
            )}
          </div>

          {/* date  */}
          {note !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Typography>
                <strong>Note :</strong> {note} / 5
              </Typography>
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
            </div>
          )}
        </div>
      </div>

      {/* Partie droite : date en bas */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          minWidth: "120px",
        }}
      >
        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
          Posté le {formattedDate}
        </Typography>
      </div>
    </div>
  );
}

export default AvisCard;
