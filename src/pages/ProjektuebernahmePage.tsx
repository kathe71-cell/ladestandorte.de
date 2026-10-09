import React from 'react';
import { SEO } from '../components/SEO';
import { Mail, ArrowRight } from 'lucide-react';

export const ProjektuebernahmePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <SEO 
        title="Projektübernahme" 
        description="Informationen zur möglichen Übernahme von ladestandorte.de"
        noIndex={true}
        canonicalPath="/projektuebernahme"
      />
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171917] tracking-tight mb-4">
            Projektübernahme
          </h1>
          <p className="text-lg text-[#6C716B] leading-relaxed">
            Eine Übernahme von ladestandorte.de als vollständiges Projekt ist grundsätzlich möglich.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFE3DC] shadow-sm space-y-6">
          <div>
            <p className="text-[#171917] leading-relaxed mb-4 font-semibold">
              Gegenstand einer möglichen Übernahme können sein:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#6C716B] marker:text-[#2F5E73]">
              <li>Domain ladestandorte.de</li>
              <li>vollständiges Website-Projekt</li>
              <li>Quellcode</li>
              <li>bestehende Inhalte</li>
              <li>projektspezifische Daten und Datenstrukturen</li>
              <li>bestehende technische Projektstruktur</li>
            </ul>
          </div>
          
          <div className="pt-6 border-t border-[#DFE3DC]">
            <h2 className="text-lg font-bold text-[#171917] mb-2">Interesse an einer Projektübernahme?</h2>
            <p className="text-[#6C716B] mb-5 text-sm">
              Anfragen bitte per E-Mail an jens@kathe.org.
            </p>
            <a 
              href="mailto:jens@kathe.org"
              onClick={() => {
                try {
                  import('@vercel/analytics').then(({ track }) => track('Contact_Projektuebernahme'));
                } catch(e) {}
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171917] hover:bg-black text-white font-bold text-sm transition-all shadow-sm active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Kontakt aufnehmen</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjektuebernahmePage;
