import Footer from '../components/Footer';

const Impressum = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="p-6 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold font-anthony mb-8">Impressum</h1>

          <div className="text-lg md:text-xl font-mono">
            <h2 className="text-xl font-bold mb-4">Angaben gemäß § 5 DDG</h2>
            <p className="mb-8">
              tHERAPY Recycle and Exorcise<br />
              Inhaberin: Mariángeles Aguirre<br />
              Hallesches Ufer 28<br />
              10963 Berlin<br />
              Deutschland
            </p>

            <h2 className="text-xl font-bold mb-4">Umsatzsteuer-ID</h2>
            <p className="mb-8">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              DE405737990
            </p>

            <h2 className="text-xl font-bold mb-4">Kontakt</h2>
            <p className="mb-8">
              Telefon: (+49) 163 685 2985<br />
              E-Mail: connect@therapy-berlin.com<br />
            </p>
            <p className="mb-8">
              <strong>Studio (nur nach Vereinbarung):</strong><br />
              Forster Straße 57, 10999 Berlin-Kreuzberg<br /><br />
              <strong>Store:</strong><br />
              RARE STORE BERLIN<br />
              Kopernikusstraße 21, 10245 Berlin-Friedrichshain
            </p>

            <h2 className="text-xl font-bold mb-4">Redaktionell verantwortlich</h2>
            <p className="mb-8">
              (Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV)
            </p>
            <p className="mb-8">
              Mariángeles Aguirre<br />
              Hallesches Ufer 28<br />
              10963 Berlin
            </p>

            <h3 className="text-xl font-bold mb-4">Haftungsausschluss (Disclaimer)</h3>

            <h4 className="text-lg font-bold mb-2">Haftung für Inhalte</h4>
            <p className="mb-8">Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

            <h4 className="text-lg font-bold mb-2">Haftung für Links</h4>
            <p className="mb-8">Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

            <h4 className="text-lg font-bold mb-2">Urheberrecht</h4>
            <p className="mb-8">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartigen Inhalte umgehend entfernen.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Impressum;
