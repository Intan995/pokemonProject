import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Modal } from "antd";

export default function PokemonPage() {
  const { data: session, status } = useSession();
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      const offset = role === "admin" ? 0 : 50; // Admin: 1–50, User: 51–100
      const limit = role === "admin" ? 20 : 10;

      axios
        .get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        .then(async (res) => {
          const pokes = res.data.results;

         const detailPromises = pokes.map(async (p) => {
            const detailRes = await axios.get(p.url);
            return {
              name: p.name,
              image: detailRes.data.sprites.front_default,
              types: detailRes.data.types.map((t) => t.type.name), // 🧠 ambil list tipe
            };
          });


          const fullDetails = await Promise.all(detailPromises);
          setPokemon(fullDetails);
        })
        .catch((err) => console.error("Error fetch Pokémon:", err));
    }
  }, [status, session]);

      const handleClick = async (poke) => {
        setSelectedPokemon(poke.name);
        setLoadingDetail(true);

        try {
          // Ambil detail species (untuk description & version)
          const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${poke.name}`);

          const descriptionEntry = speciesRes.data.flavor_text_entries.find(
            (entry) => entry.language.name === "en"
          );

          const version = descriptionEntry?.version?.name || "Unknown";

          // Ambil weaknesses berdasarkan type pertama Pokémon
          let weaknesses = [];
          if (poke.types?.length > 0) {
            const typeUrl = `https://pokeapi.co/api/v2/type/${poke.types[0]}`;
            const typeRes = await axios.get(typeUrl);
            weaknesses = typeRes.data.damage_relations.double_damage_from.map(
              (t) => t.name
            );
          }

          setPokemonDetail({
            name: poke.name,
            image: poke.image,
            types: poke.types,
            description: descriptionEntry?.flavor_text || "No description available.",
            version,
            weaknesses,
          });
        } catch (err) {
          console.error("Error fetching Pokémon detail:", err);
        } finally {
          setLoadingDetail(false);
        }
      };


  // Fungsi untuk tutup modal
  const closeModal = () => {
    setSelectedPokemon(null);
    setPokemonDetail(null);
  };

  if (status === "loading") return <p>Checking session...</p>;

  return (
    <div className="p-6"
      style={{
        backgroundImage: "url('/earth.gif')",
        backgroundRepeat: 'repeat',   // 🔥 gambar akan diulang
        backgroundSize: 'auto',       // ukuran asli gambar
       backgroundPosition: 'center',
       minHeight: '100vh',
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">
          Halo, {session?.user?.name}! 👋
        </h1>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-yellow-500 text-white px-4 py-2 text-sm rounded cursor-pointer hover:bg-yellow-600 transition"
        >
          Logout
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6">
        {/* LIST POKEMON */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {pokemon.map((p) => (
            <div
              key={p.name}
              onClick={() => handleClick(p)}
              className={`border bg-white rounded p-3 cursor-pointer text-center hover:shadow-md hover:bg-yellow-400 transition ${
                selectedPokemon === p.name ? "bg-gray-200" : ""
              }`}
            >
               <div className="flex justify-center items-center w-full mb-2">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-30 h-30 object-contain"
                />
              </div>
              <p className="capitalize font-medium">{p.name}</p>
              {/* 🧩 Tambahkan di sini */}
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {p.types?.map((type) => (
                  <span
                    key={type}
                    className={`text-xs px-2 py-1 rounded-md text-white capitalize ${
                      type === 'fire'
                        ? 'bg-red-500'
                        : type === 'water'
                        ? 'bg-blue-500'
                        : type === 'grass'
                        ? 'bg-green-500'
                        : type === 'electric'
                        ? 'bg-yellow-400 text-black'
                        : type === 'psychic'
                        ? 'bg-pink-500'
                        : type === 'rock'
                        ? 'bg-yellow-700'
                        : type === 'ground'
                        ? 'bg-amber-700'
                        : type === 'ghost'
                        ? 'bg-purple-600'
                        : type === 'ice'
                        ? 'bg-cyan-400'
                        : type === 'dragon'
                        ? 'bg-indigo-600'
                        : type === 'dark'
                        ? 'bg-gray-800'
                        : type === 'fairy'
                        ? 'bg-pink-300 text-black'
                        : 'bg-gray-400'
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>

    
      {/* MODAL POPUP */}

      <Modal
        open={!!pokemonDetail}
        onCancel={closeModal}
        footer={null}
        centered
        destroyOnHidden
        width={700} // biar modal agak lebar
      >
        {loadingDetail ? (
          <p className="text-center">Loading detail...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* 🖼 Kolom Kiri - Gambar */}
            <div className="flex flex-col items-center justify-center">
              <img
                src={pokemonDetail?.image}
                alt={pokemonDetail?.name}
                className="w-48 h-48 object-contain mb-4"
              />
              <div className="flex flex-wrap justify-center gap-2">
                {pokemonDetail?.types?.map((type) => (
                  <span
                    key={type}
                    className={`text-xs px-3 py-1 rounded-md text-white capitalize ${
                      type === "fire"
                        ? "bg-red-500"
                        : type === "water"
                        ? "bg-blue-500"
                        : type === "grass"
                        ? "bg-green-500"
                        : type === "electric"
                        ? "bg-yellow-400 text-black"
                        : type === "psychic"
                        ? "bg-pink-500"
                        : type === "rock"
                        ? "bg-yellow-700"
                        : type === "ground"
                        ? "bg-amber-700"
                        : type === "ghost"
                        ? "bg-purple-600"
                        : type === "ice"
                        ? "bg-cyan-400"
                        : type === "dragon"
                        ? "bg-indigo-600"
                        : type === "dark"
                        ? "bg-gray-800"
                        : type === "fairy"
                        ? "bg-pink-300 text-black"
                        : "bg-gray-400"
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* 📋 Kolom Kanan - Detail */}
            <div>
              <h2 className="text-2xl font-bold capitalize mb-2">{pokemonDetail?.name}</h2>

              {/* Deskripsi */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {pokemonDetail?.description}
              </p>

              {/* Version */}
              <p className="text-sm text-gray-600 mb-2">
                <strong>Version:</strong> {pokemonDetail?.version}
              </p>

              {/* Weaknesses */}
              {pokemonDetail?.weaknesses?.length > 0 && (
                <div>
                  <strong>Weaknesses:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pokemonDetail.weaknesses.map((weak) => (
                      <span
                        key={weak}
                        className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-md capitalize"
                      >
                        {weak}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>


    </div>
  );
}
