"use client";

import Link from "next/link";
import { useState } from "react";
import { CarFront, ShieldAlert, CloudSun, Ship, MapPin, PlusCircle, Bell, UserRound, Camera, Video, MessageCircle } from "lucide-react";

const categories = [
  { label: "Trafic", detail: "Bouchons, accidents, routes bloquées", Icon: CarFront },
  { label: "Sécurité", detail: "Dangers et incidents", Icon: ShieldAlert },
  { label: "Météo", detail: "Pluie, vent et vigilances", Icon: CloudSun },
  { label: "Barges", detail: "Départs et perturbations", Icon: Ship }
];

export default function Home() {
  const [showReport, setShowReport] = useState(false);
  const [category, setCategory] = useState("Embouteillage");
  const [comment, setComment] = useState("");

  return (
    <main className="shell">
      <header className="top">
        <div className="brand-mark">976</div>
        <div><p className="eyebrow">MAYOTTE 976</p><h1>INFOS DU JOUR</h1></div>
        <button className="icon-button" aria-label="Notifications"><Bell /></button>
      </header>

      <section className="welcome">
        <p className="eyebrow">BONJOUR, MAYOTTE</p>
        <h2>Toute l'information de l'île, au même endroit.</h2>
        <p>Consultez les informations locales et partagez les événements utiles à tous.</p>
      </section>

      <section className="map-card">
        <div className="section-heading"><h3>Carte de Mayotte</h3><span className="tag">Aperçu</span></div>
        <div className="map-placeholder">
          <MapPin size={30} />
          <strong>Carte interactive à connecter</strong>
          <span>Grande-Terre · Petite-Terre</span>
        </div>
        <p className="muted small">Les signalements apparaîtront ici après connexion de la carte et de la base de données.</p>
      </section>

      <section>
        <div className="section-heading"><h3>Explorer</h3><span className="muted small">4 rubriques</span></div>
        <div className="category-grid">
          {categories.map(({label, detail, Icon}) => (
            <article className="category" key={label}>
              <Icon size={25} /><h4>{label}</h4><p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <button className="report-button" onClick={() => setShowReport(!showReport)}>
        <PlusCircle /> Signaler un événement
      </button>

      {showReport && (
        <section className="report-panel">
          <h3>Nouveau signalement</h3>
          <p className="muted small">Prototype : l'envoi sera activé après création du compte et connexion à Supabase.</p>
          <label>Type d'événement</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {["Embouteillage", "Accident", "Route bloquée", "Danger sur la route", "Travaux", "Perturbation de barge", "Météo"].map(x => <option key={x}>{x}</option>)}
          </select>
          <label>Commentaire</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Décrivez brièvement la situation…" />
          <div className="media-row"><span><Camera size={17}/> Photo</span><span><Video size={17}/> Vidéo</span><span><MessageCircle size={17}/> Commentaire</span></div>
          <p className="muted small">La position GPS, le pseudo public et les médias seront ajoutés à l'étape suivante. Ne prenez pas de photo en conduisant.</p>
          <button className="secondary-button" onClick={() => setShowReport(false)}>Fermer le formulaire</button>
        </section>
      )}

      <footer><span>© Mayotte 976</span><span>Français · Shimaoré · Kibushi</span></footer>
      <nav className="bottom-nav"><span>⌂<small>Accueil</small></span><span>⌖<small>Carte</small></span><span onClick={() => setShowReport(true)}>＋<small>Signaler</small></span><span>♧<small>Alertes</small></span><Link href="/compte"><UserRound size={19}/><small>Compte</small></Link></nav>
    </main>
  );
}
