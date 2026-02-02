import Link from 'next/link';
import { GraduationCap, BookOpen, ClipboardList, Trophy, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">EduLearn</span>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Se connecter
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Apprenez à votre rythme avec{' '}
            <span className="text-indigo-600">EduLearn</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Accédez à des cours de qualité, des vidéos interactives et testez
            vos connaissances avec des QCM adaptés à votre niveau.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-lg"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors text-lg"
            >
              Voir les cours
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tout ce dont vous avez besoin pour réussir
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-indigo-50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cours Complets
              </h3>
              <p className="text-gray-600">
                Accédez à des cours structurés avec vidéos, documents PDF et
                ressources complémentaires.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-green-50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-6">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                QCM Interactifs
              </h3>
              <p className="text-gray-600">
                Testez vos connaissances avec des questionnaires à choix
                multiples après chaque cours.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-purple-50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Suivi des Progrès
              </h3>
              <p className="text-gray-600">
                Suivez votre progression et consultez l'historique de
                tous vos résultats de QCM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à commencer votre apprentissage ?
            </h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Rejoignez EduLearn et accédez à tous nos cours dès maintenant.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-lg"
            >
              Se connecter
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
              <span className="font-semibold text-gray-900">EduLearn</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} EduLearn. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
