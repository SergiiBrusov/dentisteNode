import { motion } from "framer-motion";

export default function App() {
  return (
    <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Soins dentaires équins professionnels
        </motion.h2>
        <p className="text-base sm:text-lg mb-6">
          Offrez à votre cheval le confort qu'il mérite avec un dentiste équin
          certifié.
        </p>
        <a
          href="https://ton-symfony-site.fr/login"
          className="inline-block bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition"
        >
          Prendre un rendez-vous
        </a>
      </div>
    </section>
  );
}
