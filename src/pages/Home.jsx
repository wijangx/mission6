import { useState } from "react";
import Navbar from "../components/Navbar";
import MovieSection from "../components/MovieSection";
import Footer from "../components/Footer";
import {
  continueWatching,
  topRating as initialTopRating,
  trendingMovies,
  newReleases,
} from "../data/movies";

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);

  // 1. STATE CRUD (Array of Objects)
  const [topMovies, setTopMovies] = useState(initialTopRating);

  // State Modal Form Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    duration: "2j 00m",
    ageBadge: "13+",
    genres: "Aksi, Petualangan",
    image: "/assets/duty.png",
  });

  // Handler: Buka Modal Tambah Film Baru (Create)
  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      duration: "2j 00m",
      ageBadge: "13+",
      genres: "Aksi, Drama",
      image: "/assets/duty.png",
    });
    setIsModalOpen(true);
  };

  // Handler: Buka Modal Edit Film (Update)
  const handleOpenEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || "",
      duration: movie.duration || "2j 00m",
      ageBadge: movie.ageBadge || "13+",
      genres: Array.isArray(movie.genres) ? movie.genres.join(", ") : movie.genres || "",
      image: movie.image || "/assets/duty.png",
    });
    setIsModalOpen(true);
  };

  // Handler: Hapus Film (Delete)
  const handleDeleteMovie = (id) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus film ini dari daftar?")) {
      setTopMovies((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Handler: Simpan Form (Create & Update)
  const handleSaveMovie = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedGenres = formData.genres
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    if (editingMovie) {
      // UPDATE DATA
      setTopMovies((prev) =>
        prev.map((item) =>
          item.id === editingMovie.id
            ? {
                ...item,
                title: formData.title,
                duration: formData.duration,
                ageBadge: formData.ageBadge,
                genres: parsedGenres.length > 0 ? parsedGenres : ["Drama"],
                image: formData.image || item.image,
              }
            : item
        )
      );
    } else {
      // CREATE / ADD DATA BARU
      const newMovie = {
        id: `custom-${Date.now()}`,
        title: formData.title,
        duration: formData.duration,
        ageBadge: formData.ageBadge,
        genres: parsedGenres.length > 0 ? parsedGenres : ["Aksi"],
        image: formData.image || "/assets/duty.png",
        previewImage: formData.image || "/assets/duty-ls.png",
        badgeType: "blue",
        badge: "Baru",
      };
      setTopMovies((prev) => [newMovie, ...prev]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#181a1c] text-white flex flex-col relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full aspect-[16/9] md:aspect-auto md:h-[587px] mt-[67px] md:mt-[94px] flex items-end px-5 pb-5 md:px-20 md:pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/assets/hero-bg.png"
            alt="Duty After School"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#181a1c]/40 via-transparent to-[#181a1c] to-95%" />
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#181a1c]" />
        </div>

        <div className="relative z-10 w-full flex justify-between items-end">
          <div className="max-w-[668px]">
            <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-5">
              Duty After School
            </h1>
            <p className="text-xs md:text-lg text-[#ffffff] line-clamp-2 md:line-clamp-none mb-3 md:mb-10 leading-relaxed">
              Sebuah benda tak dikenal mengambil alih dunia. Dalam keputusasaan,
              Departemen Pertahanan mulai merekrut lebih banyak tentara,
              termasuk siswa sekolah menengah. Mereka pun segera menjadi pejuang
              garis depan dalam perang.
            </p>
            <div className="flex items-center gap-2 md:gap-3">
              <button className="bg-[#0f1e93] hover:bg-[#09147a] text-white text-xs md:text-base font-bold px-3 py-2 md:px-6 md:py-2.5 rounded-full transition">
                Mulai
              </button>
              <button className="bg-[#2f3235] hover:bg-[#3f4347] text-white text-xs md:text-base font-bold px-3 py-2 md:px-6 md:py-2.5 rounded-full flex items-center gap-2 transition">
                <img
                  src="/assets/i.png"
                  alt="Info"
                  className="w-3 h-3 md:w-6 md:h-6"
                />
                <span>Selengkapnya</span>
              </button>
              <span className="border border-[#c1c2c4] text-[#ffffff] text-xs md:text-lg px-2 py-1 md:px-3 md:py-2 rounded-full">
                18+
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="shrink-0 w-10 h-10 md:w-10 md:h-10 rounded-full border border-white/40 bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition active:scale-95"
            title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
          >
            {isMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* List Film Sections */}
      <div className="-mt-2 relative z-10 space-y-6">
        <MovieSection
          title="Melanjutkan Tonton Film"
          movies={continueWatching}
          isLandscape={true}
        />

        {/* SECTION INTERAKTIF DENGAN FITUR LENGKAP CRUD */}
        <MovieSection
          title="Top Rating Film dan Series Hari ini"
          movies={topMovies}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteMovie}
          onAddClick={handleOpenAddModal}
        />

        <MovieSection
          title="Film Trending"
          movies={trendingMovies}
        />
        <MovieSection
          title="Rilis Baru"
          movies={newReleases}
        />
      </div>

      <Footer />

      {/* MODAL FORM CREATE & UPDATE ENHANCED */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#181A1C] border border-[#282A2E] rounded-[24px] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#0F1E93]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#282A2E]">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${editingMovie
                  ? "text-amber-300 bg-amber-500/15 border-amber-500/30"
                  : "text-blue-400 bg-blue-500/15 border-blue-500/30"
                }`}
                  >
                  <span
                  className={`w-1.5 h-1.5 rounded-full ${
                  editingMovie ? "bg-amber-400" : "bg-blue-400"
                  }`}
                  />
                  {editingMovie ? "Mode Ubah" : "Film Baru"}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-2">
                  {editingMovie ? "Edit Informasi Film" : "Tambah ke Daftar Film"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#22282A] border border-[#3A3D42] text-gray-400 hover:text-white hover:border-gray-300 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Live Card Preview Mini */}
            <div className="flex items-center gap-4 p-3 mb-5 bg-[#22282A]/70 border border-[#282A2E] rounded-xl">
              <img
                src={formData.image || "/assets/duty.png"}
                alt="Preview"
                className="w-14 h-20 object-cover rounded-lg shadow-md shrink-0 bg-[#181A1C]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 uppercase font-medium">Live Preview</p>
                <h4 className="text-sm md:text-base font-bold text-white truncate">
                  {formData.title.trim() || "Judul Film Anda"}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#2B2F33] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {formData.ageBadge}
                  </span>
                  <span className="text-xs text-[#C1C2C4]">{formData.duration}</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveMovie} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#C1C2C4] mb-1.5">
                  Judul Film <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Masukkan judul film..."
                  className="w-full bg-[#22282A] border border-[#3A3D42] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0F1E93] focus:ring-1 focus:ring-[#0F1E93] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#C1C2C4] mb-1.5">
                    Durasi / Episode
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="Contoh: 2j 15m"
                    className="w-full bg-[#22282A] border border-[#3A3D42] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0F1E93] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C1C2C4] mb-1.5">
                    Rating Usia
                  </label>
                  <select
                    value={formData.ageBadge}
                    onChange={(e) =>
                      setFormData({ ...formData, ageBadge: e.target.value })
                    }
                    className="w-full bg-[#22282A] border border-[#3A3D42] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0F1E93] transition"
                  >
                    <option value="SU">SU (Semua Umur)</option>
                    <option value="13+">13+</option>
                    <option value="16+">16+</option>
                    <option value="18+">18+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C1C2C4] mb-1.5">
                  Genre (pisahkan koma)
                </label>
                <input
                  type="text"
                  value={formData.genres}
                  onChange={(e) =>
                    setFormData({ ...formData, genres: e.target.value })
                  }
                  placeholder="Aksi, Fantasi, Petualangan"
                  className="w-full bg-[#22282A] border border-[#3A3D42] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0F1E93] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C1C2C4] mb-1.5">
                  Pilih Poster
                </label>
                <select
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full bg-[#22282A] border border-[#3A3D42] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0F1E93] transition"
                >
                  <option value="/assets/duty.png">Duty After School</option>
                  <option value="/assets/suzume.png">Suzume</option>
                  <option value="/assets/jurassic.png">Jurassic World</option>
                  <option value="/assets/sonic.png">Sonic 2</option>
                  <option value="/assets/big-hero.png">Big Hero 6</option>
                  <option value="/assets/missing.png">Missing</option>
                  <option value="/assets/tomorrow-war.png">The Tomorrow War</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-[#2B2F33] hover:bg-[#383C41] text-gray-300 rounded-full text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F1E93] hover:bg-[#0B1773] text-white rounded-full text-xs font-semibold transition shadow-lg shadow-[#0F1E93]/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {editingMovie ? "Simpan Perubahan" : "Tambahkan Film"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}