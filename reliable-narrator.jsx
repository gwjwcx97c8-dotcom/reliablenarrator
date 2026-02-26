import { useState, useRef, useCallback, useEffect } from "react";

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap";

// Warm, analog-journal inspired palette
const theme = {
  bg: "#F7F3ED",
  bgDeep: "#EDE7DD",
  card: "#FFFCF7",
  ink: "#2C2520",
  inkSoft: "#6B5E52",
  inkFaint: "#A89A8C",
  accent: "#C4704B",
  accentSoft: "#D4956F",
  accentGlow: "rgba(196, 112, 75, 0.12)",
  border: "#DDD5CA",
  shadow: "rgba(44, 37, 32, 0.08)",
  shadowDeep: "rgba(44, 37, 32, 0.16)",
};

const styles = {
  app: {
    fontFamily: "'DM Sans', sans-serif",
    background: theme.bg,
    color: theme.ink,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  bgTexture: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 30%, ${theme.accentGlow} 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(107, 94, 82, 0.05) 0%, transparent 50%)`,
    pointerEvents: "none",
    zIndex: 0,
  },
  content: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 480,
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    padding: "48px 0 32px",
    width: "100%",
  },
  logoMark: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 14,
    background: theme.accent,
    marginBottom: 16,
    boxShadow: `0 4px 16px ${theme.accentGlow}`,
  },
  title: {
    fontFamily: "'Libre Baskerville', serif",
    fontSize: 28,
    fontWeight: 700,
    color: theme.ink,
    margin: "0 0 6px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: theme.inkSoft,
    margin: 0,
    fontWeight: 400,
  },
  // Upload area
  uploadZone: {
    width: "100%",
    border: `2px dashed ${theme.border}`,
    borderRadius: 20,
    padding: "48px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: theme.card,
    marginBottom: 24,
  },
  uploadZoneActive: {
    borderColor: theme.accent,
    background: theme.accentGlow,
    transform: "scale(1.01)",
  },
  uploadIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: theme.bgDeep,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadText: {
    fontFamily: "'Libre Baskerville', serif",
    fontSize: 17,
    color: theme.ink,
    margin: "0 0 8px",
    fontWeight: 400,
  },
  uploadHint: {
    fontSize: 13,
    color: theme.inkFaint,
    margin: 0,
  },
  // Photo strip (thumbnail view)
  stripContainer: {
    width: "100%",
    marginBottom: 16,
  },
  stripLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.inkFaint,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 12,
  },
  strip: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    paddingBottom: 8,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    objectFit: "cover",
    flexShrink: 0,
    cursor: "pointer",
    border: `2px solid transparent`,
    transition: "all 0.2s ease",
    boxShadow: `0 2px 8px ${theme.shadow}`,
  },
  thumbActive: {
    border: `2px solid ${theme.accent}`,
    boxShadow: `0 2px 12px ${theme.accentGlow}`,
    transform: "scale(1.05)",
  },
  // Viewer
  viewer: {
    width: "100%",
    marginBottom: 24,
    animation: "fadeIn 0.4s ease",
  },
  photoCard: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    background: theme.card,
    boxShadow: `0 8px 32px ${theme.shadow}, 0 2px 8px ${theme.shadow}`,
    position: "relative",
  },
  photoImage: {
    width: "100%",
    display: "block",
    maxHeight: 420,
    objectFit: "cover",
  },
  photoFooter: {
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: `1px solid ${theme.border}`,
  },
  photoIndex: {
    fontFamily: "'Libre Baskerville', serif",
    fontSize: 14,
    color: theme.inkSoft,
    fontStyle: "italic",
  },
  photoDate: {
    fontSize: 13,
    color: theme.inkFaint,
    fontWeight: 500,
  },
  // Navigation
  navRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: "100%",
    marginBottom: 32,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    border: `1px solid ${theme.border}`,
    background: theme.card,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    boxShadow: `0 2px 8px ${theme.shadow}`,
    color: theme.ink,
    fontSize: 20,
  },
  navButtonDisabled: {
    opacity: 0.35,
    cursor: "default",
  },
  progressBar: {
    flex: 1,
    height: 4,
    background: theme.bgDeep,
    borderRadius: 2,
    overflow: "hidden",
    maxWidth: 200,
  },
  progressFill: {
    height: "100%",
    background: theme.accent,
    borderRadius: 2,
    transition: "width 0.4s ease",
  },
  // Ready prompt
  readyCard: {
    width: "100%",
    background: theme.card,
    borderRadius: 20,
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: `0 4px 24px ${theme.shadow}`,
    marginBottom: 32,
    border: `1px solid ${theme.border}`,
  },
  readyTitle: {
    fontFamily: "'Libre Baskerville', serif",
    fontSize: 20,
    color: theme.ink,
    margin: "0 0 8px",
    fontWeight: 400,
  },
  readyText: {
    fontSize: 14,
    color: theme.inkSoft,
    margin: "0 0 24px",
    lineHeight: 1.6,
  },
  startButton: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    background: theme.accent,
    border: "none",
    borderRadius: 12,
    padding: "14px 32px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: `0 4px 16px ${theme.accentGlow}`,
  },
  // Reorder hint
  reorderHint: {
    fontSize: 12,
    color: theme.inkFaint,
    textAlign: "center",
    margin: "0 0 24px",
    fontStyle: "italic",
  },
  // Add more button
  addMoreButton: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: theme.accent,
    background: "transparent",
    border: `1px solid ${theme.accent}`,
    borderRadius: 10,
    padding: "10px 20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: 24,
  },
  // Empty state photo placeholder
  emptyPhotoArea: {
    width: "100%",
    aspectRatio: "4/3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.bgDeep,
    borderRadius: 20,
    marginBottom: 24,
  },
  emptyPhotoText: {
    fontFamily: "'Libre Baskerville', serif",
    fontSize: 16,
    color: theme.inkFaint,
    fontStyle: "italic",
  },
  // Remove photo button
  removeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 10,
    background: "rgba(44, 37, 32, 0.6)",
    backdropFilter: "blur(8px)",
    border: "none",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
};

// SVG Icons
const PenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const CameraIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.inkSoft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function ReliableNarrator() {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [view, setView] = useState("upload"); // "upload" | "review" | "viewer"
  const fileInputRef = useRef(null);
  const addMoreInputRef = useRef(null);
  const stripRef = useRef(null);

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_LINK;
    document.head.appendChild(link);

    // Add global styles
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
      }
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      body { margin: 0; background: ${theme.bg}; }
      ::-webkit-scrollbar { display: none; }
      button:hover { filter: brightness(1.05); }
      button:active { transform: scale(0.97); }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(styleEl);
    };
  }, []);

  const handleFiles = useCallback((files) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const newPhotos = imageFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      date: file.lastModified ? new Date(file.lastModified) : new Date(),
    }));

    setPhotos((prev) => {
      const updated = [...prev, ...newPhotos].sort((a, b) => a.date - b.date);
      return updated;
    });

    if (newPhotos.length > 0) {
      setView("review");
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      if (currentIndex >= updated.length && updated.length > 0) {
        setCurrentIndex(updated.length - 1);
      }
      if (updated.length === 0) setView("upload");
      return updated;
    });
  };

  const goTo = (index) => {
    if (index >= 0 && index < photos.length) {
      setCurrentIndex(index);
    }
  };

  const enterViewer = () => {
    setCurrentIndex(0);
    setView("viewer");
  };

  const formatDate = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Upload View
  const renderUpload = () => (
    <div style={{ ...styles.content, animation: "fadeIn 0.5s ease" }}>
      <div style={styles.header}>
        <div style={styles.logoMark}>
          <PenIcon />
        </div>
        <h1 style={styles.title}>Reliable Narrator</h1>
        <p style={styles.subtitle}>Your week, in your words.</p>
      </div>

      <div
        style={{
          ...styles.uploadZone,
          ...(dragActive ? styles.uploadZoneActive : {}),
        }}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div style={styles.uploadIcon}>
          <CameraIcon />
        </div>
        <p style={styles.uploadText}>Drop your week's photos here</p>
        <p style={styles.uploadHint}>or tap to browse your library</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div style={styles.emptyPhotoArea}>
        <p style={styles.emptyPhotoText}>Your story starts with a photo.</p>
      </div>
    </div>
  );

  // Review View (after upload, before starting narration)
  const renderReview = () => (
    <div style={{ ...styles.content, animation: "fadeIn 0.5s ease" }}>
      <div style={styles.header}>
        <div style={styles.logoMark}>
          <PenIcon />
        </div>
        <h1 style={styles.title}>Reliable Narrator</h1>
        <p style={styles.subtitle}>
          {photos.length} photo{photos.length !== 1 ? "s" : ""} loaded
        </p>
      </div>

      <div style={styles.stripContainer}>
        <div style={styles.stripLabel}>Your week's photos</div>
        <div style={styles.strip} ref={stripRef}>
          {photos.map((photo, i) => (
            <img
              key={photo.id}
              src={photo.url}
              alt={photo.name}
              style={styles.thumb}
              onClick={() => {
                setCurrentIndex(i);
                setView("viewer");
              }}
            />
          ))}
        </div>
      </div>

      <p style={styles.reorderHint}>
        Photos are sorted by date. Tap any photo to preview it.
      </p>

      <button
        style={styles.addMoreButton}
        onClick={() => addMoreInputRef.current?.click()}
      >
        + Add more photos
        <input
          ref={addMoreInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </button>

      <div style={styles.readyCard}>
        <h2 style={styles.readyTitle}>Ready to tell your story?</h2>
        <p style={styles.readyText}>
          We'll walk through each photo together. You talk, I'll listen — and
          ask a few questions along the way.
        </p>
        <button style={styles.startButton} onClick={enterViewer}>
          Let's begin
        </button>
      </div>
    </div>
  );

  // Viewer (photo-by-photo walkthrough)
  const renderViewer = () => {
    const photo = photos[currentIndex];
    if (!photo) return null;

    return (
      <div style={{ ...styles.content, animation: "slideIn 0.3s ease" }} key={photo.id}>
        <div style={{ ...styles.header, padding: "32px 0 20px" }}>
          <h1 style={{ ...styles.title, fontSize: 22 }}>Reliable Narrator</h1>
        </div>

        <div style={styles.viewer}>
          <div style={styles.photoCard}>
            <div style={{ position: "relative" }}>
              <img src={photo.url} alt={photo.name} style={styles.photoImage} />
              <button
                style={styles.removeBtn}
                onClick={() => removePhoto(photo.id)}
                title="Remove photo"
              >
                ×
              </button>
            </div>
            <div style={styles.photoFooter}>
              <span style={styles.photoIndex}>
                {currentIndex + 1} of {photos.length}
              </span>
              <span style={styles.photoDate}>{formatDate(photo.date)}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={styles.navRow}>
          <button
            style={{
              ...styles.navButton,
              ...(currentIndex === 0 ? styles.navButtonDisabled : {}),
            }}
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <ChevronLeft />
          </button>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${((currentIndex + 1) / photos.length) * 100}%`,
              }}
            />
          </div>

          <button
            style={{
              ...styles.navButton,
              ...(currentIndex === photos.length - 1 ? styles.navButtonDisabled : {}),
            }}
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex === photos.length - 1}
          >
            <ChevronRight />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div style={{ ...styles.stripContainer, marginBottom: 32 }}>
          <div style={styles.strip}>
            {photos.map((p, i) => (
              <img
                key={p.id}
                src={p.url}
                alt={p.name}
                style={{
                  ...styles.thumb,
                  ...(i === currentIndex ? styles.thumbActive : {}),
                }}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        {/* Placeholder for future narration UI */}
        <div style={styles.readyCard}>
          <p style={{ ...styles.readyText, margin: 0, fontStyle: "italic" }}>
            "Tell me about this one..."
          </p>
          <p style={{ ...styles.readyText, margin: "12px 0 0", fontSize: 13 }}>
            Narration coming in Phase 2
          </p>
        </div>

        {/* Back to review */}
        <button
          style={{ ...styles.addMoreButton, marginBottom: 40 }}
          onClick={() => setView("review")}
        >
          ← Back to all photos
        </button>
      </div>
    );
  };

  return (
    <div style={styles.app}>
      <div style={styles.bgTexture} />
      {view === "upload" && renderUpload()}
      {view === "review" && renderReview()}
      {view === "viewer" && renderViewer()}
    </div>
  );
}
