import { useState, useRef, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";

export default function MovieCard({
  movie,
  isLandscape = false,
  onEdit,
  onDelete,
}) {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const cardRef = useRef(null);
  const hoverTimeout = useRef(null);
  const leaveTimeout = useRef(null);

  const rawGenres = movie.genres;
  const genresList = Array.isArray(rawGenres)
    ? rawGenres
    : typeof rawGenres === "string"
      ? rawGenres.split(",").map((g) => g.trim())
      : ["Aksi", "Petualangan"];

  const hasProgress = typeof movie.progress === "number";

  const handleMouseEnter = () => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    clearTimeout(leaveTimeout.current);
    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const popupWidth = 390;
        const paddingBoundary = 80;

        const calculatedTop = rect.top + rect.height / 2;
        const cardCenterX = rect.left + rect.width / 2;
        const popupHalfWidth = popupWidth / 2;

        const minLeftAllowed = paddingBoundary + popupHalfWidth;
        const maxLeftAllowed = window.innerWidth - paddingBoundary - popupHalfWidth;

        const calculatedLeft = Math.max(
          minLeftAllowed,
          Math.min(cardCenterX, maxLeftAllowed)
        );

        setCoords({
          top: calculatedTop,
          left: calculatedLeft,
        });
        setIsRendered(true);
      }
    }, 180);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    clearTimeout(leaveTimeout.current);
    setIsVisible(false);

    leaveTimeout.current = setTimeout(() => {
      setIsRendered(false);
    }, 150);
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      setIsVisible(false);
      setIsRendered(false);
    };

    if (isRendered) {
      window.addEventListener("scroll", handleScrollOrResize, { capture: true, passive: true });
      window.addEventListener("resize", handleScrollOrResize, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, { capture: true });
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isRendered]);

  useEffect(() => {
    if (isRendered) {
      const raf = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isRendered]);

  return (
    <div
      ref={cardRef}
      className={`shrink-0 relative ${
        isLandscape
          ? "w-[309px] h-[151px] md:w-[302px] md:h-[162px]"
          : "w-[95px] h-[145px] md:w-[234px] md:h-[365px]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster Statis Normal */}
      <div className="w-full h-full rounded-[6px] overflow-hidden relative cursor-pointer bg-[#22282A]">
        {!isLandscape && !isRendered && movie.badgeType === "top10" && (
          <div className="absolute top-0 right-[6px] md:right-[12px] z-10 bg-[#B71F1D] text-white text-[8px] md:text-[13px] font-bold flex flex-col items-center justify-center leading-tight w-[18px] md:w-[31px] py-1 md:py-1.5 rounded-b-[3px] md:rounded-b-[4px] shadow-md pointer-events-none">
            <span>Top</span>
            <span>10</span>
          </div>
        )}
        {!isLandscape && !isRendered && movie.badgeType === "blue" && (
          <span className="absolute top-[6px] left-[6px] md:top-4 md:left-4 z-10 bg-[#0F1E93] text-white text-[6px] md:text-[13px] font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-md pointer-events-none">
            {movie.badge}
          </span>
        )}
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover pointer-events-none"
        />
        {isLandscape && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end pointer-events-none">
            <span className="text-sm md:text-lg font-bold text-[#FFFFFF] truncate max-w-[70%]">
              {movie.title}
            </span>
            <div className="flex items-center gap-1">
              <img src="/assets/star.png" alt="Star" className="w-[10px] h-[10px] md:w-[14px] md:h-[14px]" />
              <span className="text-xs md:text-sm text-[#c1c2c4] font-medium">
                {movie.rating ? `${movie.rating}/5` : "4.5/5"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pop-up Hover via Portal */}
      {isRendered &&
        createPortal(
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              borderRadius: "20px",
            }}
            className={`hidden md:flex fixed -translate-x-1/2 -translate-y-1/2 w-[390px] ${
              isLandscape ? "h-[455px]" : "h-[465px]"
            } bg-[#181A1C] rounded-[20px] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.95)] border border-[#282A2E] flex-col justify-between pointer-events-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-[40] ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative w-full h-[215px] bg-[#22282A] shrink-0 rounded-t-[20px] overflow-hidden">
              {movie.badgeType === "top10" && (
                <div className="absolute top-0 right-[16px] z-20 bg-[#B71F1D] text-white text-[12px] font-bold flex flex-col items-center justify-center leading-tight w-[28px] py-1.5 rounded-b-[4px] shadow-md">
                  <span>Top</span>
                  <span>10</span>
                </div>
              )}
              {movie.badgeType === "blue" && (
                <span className="absolute top-3 left-3 z-20 bg-[#0F1E93] text-white text-[12px] font-bold px-2.5 py-1 rounded-full shadow-md">
                  {movie.badge}
                </span>
              )}
              <img
                src={movie.previewImage || movie.image}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181A1C]/60 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="px-6 pb-6 pt-2 flex flex-col justify-between flex-grow">
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <button type="button" className="w-[42px] h-[42px] rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition shadow">
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </button>
                  <button type="button" className="w-[42px] h-[42px] rounded-full border border-[#787A7C] bg-[#22282A]/60 hover:border-white text-white flex items-center justify-center transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </button>
                </div>

                {/* Tombol CRUD: Update & Delete */}
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(movie)}
                      className="px-3 py-1.5 bg-[#2B2F33] hover:bg-[#3F4347] border border-[#52575D] text-white rounded-full text-xs font-semibold transition"
                      title="Edit Film"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(movie.id)}
                      className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 rounded-full text-xs font-semibold transition"
                      title="Hapus Film"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {hasProgress && isLandscape ? (
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-[#3A3D42] h-[4px] rounded-full overflow-hidden">
                    <div className="bg-[#0F1E93] h-full rounded-full" style={{ width: `${movie.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm text-[#C1C2C4] font-medium pt-1">
                    <span>{movie.episodeTitle || movie.duration || "Episode 1"}</span>
                    <span>{movie.durationRemaining || "2j 33m"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="bg-[#2B2F33] border border-[#52575D] text-white px-3 py-2 rounded-full text-[16px] font-bold tracking-wide leading-none inline-flex items-center justify-center">
                    {movie.ageBadge || "13+"}
                  </span>
                  <span className="text-white font-bold text-[18px]">
                    {movie.duration || "2j 33m"}
                  </span>
                </div>
              )}

              <div className="w-full flex items-center justify-between text-[15px] text-[#C1C2C4] font-medium pt-1">
                {genresList.map((genre, idx) => (
                  <Fragment key={`${genre}-${idx}`}>
                    <span className="hover:text-white transition cursor-default pointer-events-auto">{genre}</span>
                    {idx < genresList.length - 1 && <span className="w-1.5 h-1.5 rounded-full bg-[#787A7C] shrink-0" />}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}