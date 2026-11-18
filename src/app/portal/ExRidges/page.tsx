'use client';

import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';
import { exRidgesPageUrl } from '../../../lib/exRidgesPages';
import './page.css';

/**
 * The per-ridge summary pages are ~250 MB of legacy HTML, now hosted on the
 * data server beside the tiles. The old template reached them with
 * <base href="...">; here every link goes through one helper, so the whole
 * index moves with a single constant (see src/lib/exRidgesPages.ts).
 */
type Ridge = { file: string; label: string };

const summaryUrl = (file: string) => exRidgesPageUrl(file);

/**
 * Transcribed from portal/templates/ExtinctRidgeIndexList.html. IDs 3-04 and
 * 3-17 are absent on purpose: 3-04 was never in the old list, and 3-17
 * (Murray-Molokai) was commented out there as incomplete.
 */
const EXTINCT_RIDGE_SECTIONS: { heading: string; ridges: Ridge[] }[] = [
  {
    heading: 'Atlantic Ocean',
    ridges: [
      { file: '1-01_Aegir_Ridge.html', label: 'ID 1-01 Aegir Ridge' },
      { file: '1-02_Baffin_Bay_Ridge.html', label: 'ID 1-02 Baffin Bay extinct ridge' },
      { file: '1-03_Labrador_Sea_Ex_Ridge.html', label: 'ID 1-03 Labrador Sea extinct ridge' },
      {
        file: '1-04_Alpha_Ridge.html',
        label: 'ID 1-04 Alpha Ridge (unlikely to be an extinct ridge)',
      },
      { file: '1-05_Bay_of_Biscay_Ridge.html', label: 'ID 1-05 Bay of Biscay extinct ridge' },
      {
        file: '1-06_Angolan_possible_ex_ridge.html',
        label: 'ID 1-06 Angolan Basin possible extinct ridge',
      },
      { file: '1-07_Vema_Channel.html', label: 'ID 1-07 Vema Channel' },
      { file: '1-08_Abimael_Ex_Ridge.html', label: 'ID 1-08 Abimael Ridge, Santos Basin' },
      {
        file: '1-09_North_Falkand_possible_ex_ridge.html',
        label: 'ID 1-09 North Falkland possible extinct ridge',
      },
      { file: '1-10_Agulhas_Ex_Ridge.html', label: 'ID 1-10 Agulhas extinct ridge' },
    ],
  },
  {
    heading: 'Indian Ocean',
    ridges: [
      { file: '2-01_West_Somali_Basin_Ex_Ridge.html', label: 'ID 2-01 West Somali Basin' },
      { file: '2-02_Natal_Basin.html', label: 'ID 2-02 Northern Natal Basin' },
      { file: '2-03_Mascarene_Basin.html', label: 'ID 2-03 Mascarene Basin' },
      {
        file: '2-04_Conrad-DelCano_Ridge.html',
        label: 'ID 2-04 Proposed extinct ridge between the Del-Cano Rise and the Conrad Rise',
      },
      {
        file: '2-05_South_Conrad_Rise_FZ.html',
        label: 'ID 2-05 Possible extinct spreading centre, south of the Conrad Rise',
      },
      { file: '2-06_Enderby_Basin.html', label: 'ID 2-06 Enderby Basin' },
      {
        file: '2-07_Perth_Abyssal_Plain_overview.html',
        label: 'ID 2-07 Perth Abyssal Plain suggested extinct ridge locations',
      },
      {
        file: '2-08_Gonneville_Triangle_region.html',
        label: 'ID 2-08 Gonneville Triangle, Southern Perth Abyssal Plain',
      },
      {
        file: '2-09_Cuvier_Abyssal_Plain.html',
        label: 'ID 2-09 Cuvier Abyssal Plain suggested extinct ridge locations',
      },
      { file: '2-10_Wallaby_Ridge.html', label: 'ID 2-10 Wallaby Ridge' },
      { file: '2-11_Gascoyne_Abyssal_Plain.html', label: 'ID 2-11 Gascoyne Abyssal Plain' },
      { file: '2-12_Wharton_Basin.html', label: 'ID 2-12 Wharton Basin Extinct Ridge' },
      { file: '2-13_Eighty-Five_East_ridge.html', label: 'ID 2-13 Eighty Five East Ridge' },
      { file: '2-14_Laxmi_Basin.html', label: 'ID 2-14 Laxmi Basin' },
      { file: '2-15_Gop_Basin.html', label: 'ID 2-15 Gop Basin' },
      { file: '2-16_Mammerickx.html', label: 'ID 2-16 Mammerickx microplate extinct ridge' },
    ],
  },
  {
    heading: 'Pacific Ocean',
    ridges: [
      { file: '3-01_Adare_Trough.html', label: 'ID 3-01 Adare Trough' },
      { file: '3-02_Dampier_Ridge.html', label: 'ID 3-02 Dampier Ridge' },
      { file: '3-03_Osbourn_Trough.html', label: 'ID 3-03 Osbourne Torugh' },
      { file: '3-05_Ellice_Basin.html', label: 'ID 3-05 Ellice Basin extinct ridge' },
      { file: '3-06_Ontong_Java.html', label: 'ID 3-06 Ontong Java extinct ridge' },
      { file: '3-07_Penrhyn_Basin.html', label: 'ID 3-07 Penrhyn Basin extinct ridge' },
      { file: '3-08_Manihiki.html', label: 'ID 3-08 Manihiki Plateau extinct ridge' },
      { file: '3-09_Tongareva.html', label: 'ID 3-09 Tongareva extinct ridge' },
      { file: '3-10_Hokkaido_trough.html', label: 'ID 3-10 Hokkaido possible extinct ridge' },
      { file: '3-11_Kula.html', label: 'ID 3-11 Kula extinct ridge' },
      { file: '3-12_Chinook_trough.html', label: 'ID 3-12 Chinook Trough possible extinct ridge' },
      { file: '3-13_Liliuokalani.html', label: 'ID 3-13 Liliuokalani fracture zone' },
      {
        file: '3-14_Emperor.html',
        label: 'ID 3-14 Emperor fracture zone (unlikely to be an extinct ridge)',
      },
      { file: '3-15_Magellan.html', label: 'ID 3-15 Magellan Trough' },
      { file: '3-16_West_Magellan.html', label: 'ID 3-16 West Magellan extinct ridge' },
      { file: '3-18_Guadalupe.html', label: 'ID 3-18 Guadalupe extinct ridge' },
      { file: '3-19_Magdalena.html', label: 'ID 3-19 Magdalena extinct ridge' },
      { file: '3-20_Mathematician.html', label: 'ID 3-20 Mathematician extinct ridge' },
      { file: '3-21_Tehuantepec.html', label: 'ID 3-21 Tehuantepec Ridge jumps' },
      { file: '3-22_Galapagos_Rise.html', label: 'ID 3-22 Galapagos Rise extinct ridge' },
      { file: '3-23_Bauer_Scarp.html', label: 'ID 3-23 Bauer Scarp' },
      {
        file: '3-24_Selkirk.html',
        label: 'ID 3-24 Selkirk extinct microplate spreading centre',
      },
      { file: '3-25_Shirley.html', label: "ID 3-25 'Shirley' fracture zone ridge-jumps" },
      { file: '3-26_Sandra.html', label: 'ID 3-26 Sandra extinct ridge, Panama Basin' },
      { file: '3-27_Carnegie_ridge_jumps.html', label: 'ID 3-27 Carnegie ridge jumps' },
      { file: '3-28_Cocos_ridge-jumps.html', label: 'ID 3-28 Cocos spreading centre ridge-jumps' },
      { file: '3-29_Nazca.html', label: 'ID 3-29 Nazca Ridge failed propagator' },
      { file: '3-30_Malpelo.html', label: 'ID 3-30 Malpelo extinct ridge' },
      { file: '3-31_Friday_microplate.html', label: 'ID 3-31 Friday Microplate' },
      { file: '3-32_Phoenix.html', label: 'ID 3-32 Phoenix extinct ridge' },
      { file: '3-33_Hudson_microplate.html', label: 'ID 3-33 Hudson extinct microplate' },
      { file: '3-34_Monterey.html', label: 'ID 3-34 Monterey extinct ridge' },
      { file: '3-35_Mendoza.html', label: 'ID 3-35 Mendoza ridge-jump' },
      { file: '3-36_Gallego.html', label: 'ID 3-36 Gallego ridge-jump' },
      { file: '3-37_Roggeveen.html', label: 'ID 3-37 Roggeveen ridge-jump' },
      { file: '3-38_NovaCanton.html', label: 'ID 3-38 Nova Canton possible extinct ridge' },
    ],
  },
  {
    heading: 'Marginal Basins',
    ridges: [
      { file: '4-01_South_China_Sea.html', label: 'ID 4-01 South China Sea extinct ridge' },
      {
        file: '4-02_West_Philippine.html',
        label: 'ID 4-02 West Philippine Sea/Central Basin Fault extinct ridge',
      },
      { file: '4-03_Celebes_Sea.html', label: 'ID 4-03 Celebes Sea possible extinct ridge' },
      { file: '4-04_Mati_Palau.html', label: 'ID 4-04 Mati and Palau possible extinct ridges' },
      {
        file: '4-05_Parece-Vela_Shikoku.html',
        label: 'ID 4-05 Parece-Vela Shikoku extinct ridge',
      },
      {
        file: '4-06_Caroline_Basin.html',
        label: 'ID 4-06 Caroline Trough and possible ridge jumps',
      },
      { file: '4-07_Kilsgaard_Trough.html', label: 'ID 4-07 Kilsgaard Trough' },
      {
        file: '4-08_Damar_Basin.html',
        label: 'ID 4-08 Damar Basin extinct ridge, Banda Sea',
      },
      { file: '4-09_Gulf_of_Mexico.html', label: 'ID 4-09 Gulf of Mexico extinct ridge' },
      { file: '4-10_Grenada_Basin.html', label: 'ID 4-10 Grenada Basin extinct ridge' },
      { file: '4-11_Komandorsky.html', label: 'ID 4-11 Komandorsky Basin extinct ridge' },
      { file: '4-12_Canada_Basin.html', label: 'ID 4-12 Canada Basin extinct ridge' },
      { file: '4-13_Makarov_Basin.html', label: 'ID 4-13 Makarov Basin extinct ridge' },
      { file: '4-14_Tasman_Sea.html', label: 'ID 4-14 Tasman Sea extinct ridge' },
      { file: '4-15_Coral_Sea.html', label: 'ID 4-15 Coral Sea extinct ridge' },
      { file: '4-16_West_Scotia_Sea.html', label: 'ID 4-16 Western Scotia Sea extinct ridge' },
      { file: '4-17_Protector_Basin.html', label: 'ID 4-17 Protector Basin extinct ridge' },
      { file: '4-18_Dove_Basin.html', label: 'ID 4-18 Dove Basin extinct ridge' },
      { file: '4-19_Weddell_Sea.html', label: 'ID 4-19 Weddell Sea extinct ridge' },
      { file: '4-20_Powell_Basin.html', label: 'ID 4-20 Powell Basin extinct ridge' },
      { file: '4-21_Jane_Basin.html', label: 'ID 4-21 Jane Basin extinct ridge' },
      { file: '4-22_South_Fiji.html', label: 'ID 4-22 South Fiji Basin extinct ridge' },
      {
        file: '4-23_Three_Kings_Ridge.html',
        label: 'ID 4-23 Three Kings Ridge (not an extinct ridge)',
      },
      {
        file: '4-24_South_Rennell.html',
        label: 'ID 4-24 South Rennell Trough possible extinct ridge',
      },
      { file: '4-25_Sea_of_Japan.html', label: 'ID 4-25 Sea of Japan' },
      {
        file: '4-26_Ligurian_Basin.html',
        label: 'ID 4-26 Ligurian Basin possible extinct ridge',
      },
    ],
  },
];

const ACTIVE_RIDGES: Ridge[] = [
  { file: 'AR01_Southern_MidAtlanticRidge.html', label: 'AR-01 Southern Mid-Atlantic Ridge' },
  { file: 'AR02_Southwest_Indian_Ridge.html', label: 'AR-02 Southwest Indian Ridge' },
  { file: 'AR03_Southeast_Indian_Ridge.html', label: 'AR-03 Southeast Indian Ridge' },
  { file: 'AR04_Pacific-Antarctic_ridge.html', label: 'AR-04 Pacific-Antarctic spreading ridge' },
  { file: 'AR05_EastPacificRise.html', label: 'AR-05 East Pacific Rise spreading ridge' },
  {
    file: 'AR06_Juan_de_Fuca.html',
    label: 'AR-06 Juan de Fuca fragmented plate spreading ridge',
  },
  { file: 'AR07_Rivera.html', label: 'AR-07 Rivera fragmented plate spreading ridge' },
  { file: 'AR08_Easter_Microplate.html', label: 'AR-08 Easter Microplate spreading ridge' },
  {
    file: 'AR09_JuanFernandez_Microplate.html',
    label: 'AR-09 Juan Fernandez Microplate spreading ridge',
  },
  {
    file: 'AR10_Mariana_Trough.html',
    label: 'AR-10 Mariana Trough back-arc basin spreading ridge',
  },
  {
    file: 'AR11_CentralRidge_NFB.html',
    label: 'AR-11 Central Ridge back-arc basin spreading ridge, North Fiji Basin',
  },
  {
    file: 'AR12_PandoraRidge_NFB.html',
    label: 'AR-12 South Pandora back-arc basin spreading ridge',
  },
  {
    file: 'AR13_WestFijiRidge_NFB.html',
    label: 'AR-13 West Fiji back-arc basin spreading ridge',
  },
  {
    file: 'AR14_SthSandwich.html',
    label: 'AR-14 South Sandwich back-arc basin spreading ridge',
  },
];

function RidgeList({ ridges }: { ridges: Ridge[] }) {
  return (
    <ul className="exridges-index">
      {ridges.map((ridge) => (
        <li key={ridge.file}>
          <a href={summaryUrl(ridge.file)} target="_blank" rel="noreferrer">
            {ridge.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function ExRidgesPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1>Global review and digital database of large-scale extinct spreading centers</h1>

        <p>
          Extinct mid-ocean ridges record past plate boundary reorganizations, and identifying their
          locations is crucial to developing a better understanding of the drivers of plate tectonics
          and oceanic crustal accretion. Frequently, extinct ridges cannot be easily identified within
          existing geophysical data sets, and there are many controversial examples that are poorly
          constrained. We analyze the axial morphology and gravity signal of 29 well-constrained,
          global, large-scale extinct ridges (classed as Primary Tier ridges) that are digitized from
          global data sets, to describe their key characteristics. Additionally, the characteristics of
          a representative collection of active spreading centers are analyzed to review the
          present-day variation in the bathymetry and gravity signal of ridges in different tectonic
          settings such as backarc basin ridges, microplate ridges, and large-scale plate boundaries
          with varied spreading rates. Uncertain extinct ridge-like structures (classed as Secondary
          Tier ridges or Excluded from analysis) are evaluated in comparison with the signals of
          well-defined extinct ridges, and we assess whether their morphology and gravity signals are
          within the range seen at extinct (or active) ridges. Our review of a large number of
          controversial extinct ridge locations offers some insight into which proposed locations are
          more likely to have been former spreading centers, and our analysis further leads to the
          discovery of several previously unidentified structures in the south of the West Philippine
          Basin that likely represent extinct ridges and a possible extinct ridge in the western South
          Atlantic. The global compilation of data and alayses of individual ridges is presented within
          this GPlates Portal page.
        </p>

        <p>
          The linked summary pages below provide a detailed catalogue of extinct spreading centres that
          have been reported within present-day oceanic crust. This catalogue improves access to the
          data that have been collected at extinct spreading centres over many years of research that
          have not previously been synthesized. Key details from published studies are briefly
          summarized, including existing hypotheses for cessation of spreading, tectonic influences at
          the time of extinction and cessation style. This information, however, is not readily
          available for all of the extinct ridges included here, and therefore the depth of discussion
          varies significantly between regions. Some key references are provided, rather than an
          exhaustive list of all previous studies at individual centres. We adopt the timescale of Gee
          and Kent (2007) when referring to the timing of spreading cessation.
        </p>

        <p>
          Maps are provided for each location where an extinct spreading centres has been suggested in
          previous studies or where an identification could reasonably be made from the seafloor
          bathymetric or gravity signature. The maps show the inferred position of axial segments in
          relation to:
          <br />
          A) Regional bathymetry (Weatherall et al., 2015, GEBCO_2014_1D, version 20141103)
          <br />
          B) Gridded vertical gravity gradient (Sandwell et al., 2014, V. 23.1)
          <br />
          C) Free-air gravity grids (Sandwell et al., 2014, V. 23.1)
          <br />
          D) Magnetic anomaly identifications contained within the online database hosted by the
          University of Hawaii (Seton et al., 2014) and the gridded magnetic anomaly map (WDMAM, Maus
          et al., 2007).
        </p>

        <p>
          Profiles across the inferred extinct ridge axial segments are shown, that have sampled a
          global bathymetry dataset (Weatherall et al., 2015, GEBCO_2014_1D, version 20141103) and the
          global free-air gravity grid (Sandwell et al., 2014, V23.1). Individual digitized segments
          from each spreading system are shown, with segment numbers listed above the profiles. The
          grey shaded area encloses the envelope of the median absolute deviation. The black-solid line
          is the median stacked profile and the coloured line shows the &lsquo;representative
          profile&rsquo; that was chosen to calculate the characteristics of the ridge axis for that
          segment. The minimum (white filled circle) and maximum (red filled circle) values are shown
          and the distances between them are shown, as explained in Figure 3 (MacLeod et al., 2017).
          The colour of the representative profile corresponds to the colours of segment on maps in S3.
        </p>

        <p>
          Note that some of the locations shown in the &apos;Secondary&apos; and &apos;Excluded&apos;
          classes are controversial and may not in fact represent a former axis of spreading.
        </p>

        <p>
          The ridge names and identification numbers (ID#-##) listed below can be cross-referenced
          with Table 1A - 1D in the manuscript. These summaries form part of the Supplemental Materials
          for the manuscript: MacLeod, S. J., Williams, S. E., Matthews, K. J., M&uuml;ller, R. D. and
          Qing, Xiaodong, 2017 (in press), Global review and digital database of large-scale extinct
          spreading centers, Geosphere, v. 13, doi:10.1130/GES01379.1.
        </p>

        <p>
          <a className="legacy-success-btn" href="/cesium/?view=ExRidges" target="_blank" rel="noreferrer">
            View Extinct Ridges in 3D Globe
          </a>
        </p>

        <h2>Index of extinct spreading ridge summaries</h2>

        {EXTINCT_RIDGE_SECTIONS.map((section) => (
          <section key={section.heading}>
            <h3>{section.heading}</h3>
            <RidgeList ridges={section.ridges} />
          </section>
        ))}

        <section>
          <h2>Active spreading ridge segments analyzed for comparison</h2>
          <RidgeList ridges={ACTIVE_RIDGES} />
        </section>

        <h2>References</h2>

        <p>
          MacLeod, S. J., Williams, S. E., Matthews, K. J., M&uuml;ller, R. D. and Qing, Xiaodong, 2017
          (in press), Global review and digital database of large-scale extinct spreading centers,
          Geosphere, v. 13, doi:10.1130/GES01379.1.
        </p>

        <p>
          Maus, S., Sazonova, T., Hemant, K., Fairhead, J.D. and Ravat, D., 2007, National geophysical
          data center candidate for the world digital magnetic anomaly map, Geochemistry, Geophysics,
          Geosystems, 8(6).
        </p>

        <p>
          Sandwell, D. T., M&uuml;ller, R. D., Smith, W. H. F., Garcia, E. S., Francis, R., 2014, New
          global marine gravity model from CryoSat-2 and Jason-1 reveals buried tectonic structure,
          Science, v. 346, p. 65&ndash;67.
        </p>

        <p>
          Seton, M., Whittaker, J.M., Wessel, P., M&uuml;ller, R.D., DeMets, C., Merkouriev, S., Cande,
          S., Gaina, C., Eagles, G., Granot, R., Stock, J., Wright, N. and Williams, S. E., 2014,
          Community infrastructure and repository for marine magnetic identifications, Geochemistry,
          Geophysics, Geosystems, v. 15, no. 4, p. 1629&ndash;1641, doi: 10.1002/2013GC005176.
        </p>

        <p>
          Weatherall, P., Marks, K. M., Jakobsson, M., Schmitt, T., Tani, S., Arndt, J. E., Rovere, M.,
          Chayes, D., Ferrini, V., Wigley, R., 2015, A new digital bathymetric model of the
          world&rsquo;s oceans, Earth and Space Science, v. 2, no. 1, p. 331&ndash;345, doi:
          10.1002/2015EA000107.
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
