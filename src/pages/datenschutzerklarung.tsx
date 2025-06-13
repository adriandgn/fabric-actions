import Footer from '../components/Footer';

const Datenschutzerklarung = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="p-6 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold font-anthony mb-8">Datenschutzerklärung</h1>
          <div className="text-lg md:text-xl font-mono">
            <h2 className="text-xl font-bold mb-4">1. Datenschutz auf einen Blick</h2>
            <p className="mb-8">Allgemeine Hinweise<br />
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
            <h2 className="text-xl font-bold mb-4">2. Datenerfassung auf unserer Website</h2>
            <p className="mb-8">Wer ist verantwortlich für die Datenerfassung auf dieser Website?<br />
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
            <h2 className="text-xl font-bold mb-4">3. Ihre Rechte</h2>
            <p className="mb-8">Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen.</p>
            <h2 className="text-xl font-bold mb-4">4. Analyse-Tools und Tools von Drittanbietern</h2>
            <p className="mb-8">Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen. Die Analyse Ihres Surf-Verhaltens erfolgt in der Regel anonym; das Surf-Verhalten kann nicht zu Ihnen zurückverfolgt werden.</p>
            <h2 className="text-xl font-bold mb-4">5. Weitere Informationen</h2>
            <p className="mb-8">Weitere Details zum Datenschutz finden Sie in den einzelnen Abschnitten dieser Datenschutzerklärung oder können Sie direkt bei uns erfragen.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Datenschutzerklarung;
