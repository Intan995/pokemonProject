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
              url: p.url,
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
      const speciesRes = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${poke.name}`
      );

      setPokemonDetail({
        name: poke.name,
        image: poke.image,
        description:
          speciesRes.data.flavor_text_entries.find(
            (entry) => entry.language.name === "en"
          )?.flavor_text || "No description available.",
      });
    } catch (err) {
      console.error(err);
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
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh'
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">
          Halo, {session?.user?.name}! 👋
        </h1>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-yellow-600 transition"
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
              <img
                src={p.image}
                alt={p.name}
                className="w-20 h-20 mx-auto mb-2"
              />
              <p className="capitalize font-medium">{p.name}</p>
            </div>
          ))}
        </div>
      </div>

    
      {/* MODAL POPUP */}

      <Modal
        open={!!pokemonDetail}        // buka modal jika ada pokemonDetail
        onCancel={closeModal}         // tutup modal saat klik luar / tombol close
        footer={null}                 // hilangkan footer default (Ok, Cancel)
        centered                     // modal di tengah layar
        destroyOnHidden                              // agar state modal dibersihkan saat close
      >
        {loadingDetail ? (
          <p>Loading detail...</p>
        ) : (
          <>
            <img
              src={pokemonDetail?.image}
              alt={pokemonDetail?.name}
              className="w-40 h-40 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold capitalize mb-2 text-center">
              {pokemonDetail?.name}
            </h2>
            <p className="text-gray-700">{pokemonDetail?.description}</p>

            <div className="flex justify-center mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-yellow-400"
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>

    </div>
  );
}
