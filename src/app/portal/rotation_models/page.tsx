'use client';

import { SiteFooter } from '../../../components/SiteFooter';
import { SiteHeader } from '../../../components/SiteHeader';

export default function RotationModelsPage() {
  return (
    <main className="portal-page">
      <SiteHeader />
      <div className="container portal-content legacy-content">
        <h1 style={{ textAlign: 'center' }}>Rotation Models</h1>

        <h2>EarthByte Global Rotation Model 2012</h2>
        <p>
          Global plate motion models provide a spatial and temporal framework for geological data and have been
          effective tools for exploring processes occurring at the earth&apos;s surface. However, published models
          either have insufficient temporal coverage or fail to treat tectonic plates in a self-consistent manner.
          They usually consider the motions of selected features attached to tectonic plates, such as continents,
          but generally do not explicitly account for the continuous evolution of plate boundaries through time. In
          order to explore the coupling between the surface and mantle, plate models are required that extend over
          at least a few hundred million years and treat plates as dynamic features with dynamically evolving plate
          boundaries. We have constructed a new type of global plate motion model consisting of a set of
          continuously-closing topological plate polygons with associated plate boundaries and plate velocities
          since the break-up of the supercontinent Pangea. Our model is underpinned by plate motions derived from
          reconstructing the seafloor-spreading history of the ocean basins and motions of the continents and
          utilizes a hybrid absolute reference frame, based on a moving hotspot model for the last 100 Ma, and a
          true-polar wander corrected paleomagnetic model for 200 to 100 Ma. Detailed regional geological and
          geophysical observations constrain plate boundary inception or cessation, and time-dependent geometry.
          Although our plate model is primarily designed as a reference model for a new generation of geodynamic
          studies by providing the surface boundary conditions for the deep earth, it is also useful for studies in
          disparate fields when a framework is needed for analyzing and interpreting spatio-temporal data.
        </p>
        <p>
          Citation:
          <br />
          Seton, M., Müller, R.D., Zahirovic, S., Gaina, C., Torsvik, T. H., Shephard, G., Talsma, A., Gurnis, M.,
          Turner, M., Maus, S., and Chandler, M. 2012.{' '}
          <a href="http://www.sciencedirect.com/science/article/pii/S0012825212000311" target="_blank" rel="noreferrer">
            Global continental and ocean basin reconstructions since 200 Ma
          </a>
          , Earth-Science Reviews, 113: 212-270, DOI: 10.1016/j.earscirev.2012.03.002.
        </p>

        <h2>EarthByte Global Rotation Model 2016</h2>
        <p>
          Many aspects of deep-time Earth System models, including mantle convection, paleoclimatology,
          paleobiogeography and the deep Earth carbon cycle, require high-resolution plate motion models that
          include the evolution of the mosaic of plate boundaries through time. We present the first continuous
          late Paleozoic to present-day global plate model with evolving plate boundaries, building on and
          extending two previously published models for the late Paleozoic (410-250 Ma) and Mesozoic-Cenozoic
          (230-0 Ma). We ensure continuity during the 250-230 Ma transition period between the two models, update
          the absolute reference frame of the Mesozoic-Cenozoic model and add a new Paleozoic reconstruction for the
          Baltica-derived Alexander Terrane, now accreted to western North America. This 410-0 Ma open access model
          provides a framework for deep-time whole Earth modelling and acts as a base for future extensions and
          refinement.
        </p>
        <p>
          Citation:
          <br />
          Matthews, K. J., Maloney, K. T., Zahirovic, S., Williams, S. E., Seton, M., and Müller, R. D.,{' '}
          <a href="http://www.sciencedirect.com/science/article/pii/S0921818116302417" target="_blank" rel="noreferrer">
            Global plate boundary evolution and kinematics since the late Paleozoic
          </a>{' '}
          Global and Planetary Change, 146: 226-250. DOI: 10.1016/j.gloplacha.2016.10.002
        </p>

        <h2>Hybrid Hotspot Model (Moving and Fixed Hotspots)</h2>
        <p>
          The &quot;hybrid hotspot model&quot; is based on moving African hotspots (located in the Indian and
          Atlantic oceans) from 100 Ma to present (O&apos;Neill et al., 2005), and fixed hotspots (Müller et al.,
          1993) for older times. The generation of a reference frame based on the differential motion of individual
          hotspot tracks requires a consideration of backward-advected large-scale mantle flow based on seismic
          tomography, viscosity structure and plate motions, as well as the location of plume conduit contact with
          the lithosphere (Torsvik et al., 2010). Limitations of the O&apos;Neill et al. (2005) method for moving
          hotspots include the linearity and reliability of age data along a hotspot track, neo-volcanism, and
          possible plume-ridge interaction (O&apos;Neill et al., 2005; Torsvik et al., 2010).
        </p>
        <p>
          Citation:
          <br />
          Shephard, G. E., H-P. Bunge, B.S.A. Schuberth, R.D. Müller, A.S. Talsma, C. Moder, and T. Landgrebe. 2012.{' '}
          <a
            href="https://www.earthbyte.org/resource-accompaniment-to-testing-absolute-plate-reference-frames-and-the-implications-for-the-generation-of-geodynamic-mantle-heterogeneity-structure/"
            target="_blank"
            rel="noreferrer"
          >
            Testing absolute plate reference frames and the implications for the generation of geodynamic mantle
            heterogeneity structure.
          </a>{' '}
          Earth and Planetary Science Letters 317-318 p 204-217 doi:10.1016/j.epsl.2011.11.027.
        </p>

        <h2>Fixed Hotspot Model</h2>
        <p>
          This model is based on the geometry and radiometric age dates of volcanic chains with age progression from
          the Indian and Atlantic oceans, covering ages from ~132 Ma to present-day, combined with a relative plate
          motion model and assuming hotspot fixity (Müller et al., 1993). For consistency across models, imposed
          rotations for Africa have been extrapolated back to 140 Ma. Compared to Pacific hotspots, Indo-Atlantic
          hotspots are thought to have moved considerably less relative to each other. Prior to 80 Ma the rotations
          (including the Indian, Australian and Antarctic plates) are based only on the geometry and age progression
          of the New England seamount chain and the Walvis Ridge/Rio Grande Rise. Disagreements between hotspot and
          palaeomagnetic reference frames have been documented for India (Müller et al., 1994) and Australia (Idnurm,
          1985), suggesting that the mantle underlying the Indian Ocean may not have provided a fixed reference
          frame. Palaeopoles for India from the Rajmahal Traps (Das et al., 1996; Rao and Rao, 1996) result in a
          palaeolatitude of the traps at their time of formation (~117 Ma) at 47°S (±400 km), whereas the Müller et
          al. (1993) model places them at 40°S (±400 km). A comparison of mid-Cretaceous (122-80 Ma) palaeo-latitudes
          of North America (NAM) and Africa from palaeomagnetic data with those from hotspot tracks (Van Fossen and
          Kent, 1992) provided evidence for an 11-13° discrepancy, indicating that Atlantic hotspots may have moved
          southwards between 100 and 130 Ma. However, others argue that this apparent southward movement was caused
          by TPW (Prévot et al., 2000).
        </p>
        <p>
          Citation:
          <br />
          Shephard, G. E., H-P. Bunge, B.S.A. Schuberth, R.D. Müller, A.S. Talsma, C. Moder, and T. Landgrebe. 2012.{' '}
          <a
            href="https://www.earthbyte.org/resource-accompaniment-to-testing-absolute-plate-reference-frames-and-the-implications-for-the-generation-of-geodynamic-mantle-heterogeneity-structure/"
            target="_blank"
            rel="noreferrer"
          >
            Testing absolute plate reference frames and the implications for the generation of geodynamic mantle
            heterogeneity structure.
          </a>{' '}
          Earth and Planetary Science Letters 317-318 p 204-217 doi:10.1016/j.epsl.2011.11.027.
        </p>

        <h2>Hybrid Hotspot and Palaeomagnetic Model</h2>
        <p>
          This model uses moving Indo-African hotspots from 100 Ma to present (O&apos;Neill et al., 2005) and a
          palaeomagnetic model (Torsvik et al., 2008) between 140 and 100 Ma. Herein, this model is referred to as
          the &quot;hybrid palaeomagnetic model&quot;. In this model Africa is longitudinally fixed from 140 to 100
          Ma, the rationale of which is based on the assumption that Africa has been surrounded by mid-ocean ridges
          since the breakup of Pangea (Torsvik et al., 2008).
        </p>
        <p>
          Citation:
          <br />
          Shephard, G. E., H-P. Bunge, B.S.A. Schuberth, R.D. Müller, A.S. Talsma, C. Moder, and T. Landgrebe. 2012.{' '}
          <a
            href="https://www.earthbyte.org/resource-accompaniment-to-testing-absolute-plate-reference-frames-and-the-implications-for-the-generation-of-geodynamic-mantle-heterogeneity-structure/"
            target="_blank"
            rel="noreferrer"
          >
            Testing absolute plate reference frames and the implications for the generation of geodynamic mantle
            heterogeneity structure.
          </a>{' '}
          Earth and Planetary Science Letters 317-318 p 204-217 doi:10.1016/j.epsl.2011.11.027.
        </p>

        <h2>Hybrid Hotspot and TPW-corrected Palaeomagnetic Model</h2>
        <p>
          This model also uses the moving Indo-African hotspots (O&apos;Neill et al., 2005) for times after 100 Ma
          and a TPW-corrected palaeomagnetic framework (Steinberger and Torsvik, 2008) for earlier times. This model
          also assumes zero longitudinal motion of Africa and will be referred to as the &quot;hybrid TPW-corrected
          model&quot;.
        </p>
        <p>
          Citation:
          <br />
          Shephard, G. E., H-P. Bunge, B.S.A. Schuberth, R.D. Müller, A.S. Talsma, C. Moder, and T. Landgrebe. 2012.{' '}
          <a
            href="https://www.earthbyte.org/resource-accompaniment-to-testing-absolute-plate-reference-frames-and-the-implications-for-the-generation-of-geodynamic-mantle-heterogeneity-structure/"
            target="_blank"
            rel="noreferrer"
          >
            Testing absolute plate reference frames and the implications for the generation of geodynamic mantle
            heterogeneity structure.
          </a>{' '}
          Earth and Planetary Science Letters 317-318 p 204-217 doi:10.1016/j.epsl.2011.11.027.
        </p>

        <h2>Subduction Reference Frame</h2>
        <p>
          We also include a recently published model which used a novel approach of correcting absolute plate
          motion based on the location of subducted slabs in the mantle, slab sinking rates and the location of
          surface subduction (van der Meer et al., 2010). This subduction reference model is based on the hybrid
          TPW-corrected model (O&apos;Neill et al., 2005; Steinberger and Torsvik, 2008), but imposes a slab
          correction for times older than 20 Ma. In theory this model provides improved constraints on absolute
          plate motion because it does not solely rely on hotspots or palaeomagnetic data. Instead van der Meer et
          al. (2010) correlate geological data related to the initiation or cessation of subduction at the surface
          to deep mantle structures, using a total of 28 slabs imaged by p-wave tomography. They attempt to relate
          the surface palaeo-position at key ages and the current depth of subducted slabs to each other, assuming
          that slabs sink vertically. They suggest that three well-imaged deep mantle anomalies are up to 18°
          longitudinally skewed to the east at 160 Ma relative to previously published reconstructions. They correct
          this apparent misfit by adding a time-dependent longitudinal shift to the hybrid TPW-corrected model.
        </p>
        <p>
          Citation:
          <br />
          Shephard, G. E., H-P. Bunge, B.S.A. Schuberth, R.D. Müller, A.S. Talsma, C. Moder, and T. Landgrebe. 2012.{' '}
          <a
            href="https://www.earthbyte.org/resource-accompaniment-to-testing-absolute-plate-reference-frames-and-the-implications-for-the-generation-of-geodynamic-mantle-heterogeneity-structure/"
            target="_blank"
            rel="noreferrer"
          >
            Testing absolute plate reference frames and the implications for the generation of geodynamic mantle
            heterogeneity structure.
          </a>{' '}
          Earth and Planetary Science Letters 317-318 p 204-217 doi:10.1016/j.epsl.2011.11.027.
        </p>

        <h2>Phanerozoic Plate Reconstructions</h2>
        <p>
          We base our Phanerozoic relative plate motions on the rotation model made available in the Supplement of
          Golonka (2007), and use block outlines based on terrane boundaries used in Seton et al. (2012) and
          interpretations of magnetic and gravity anomalies. The relative plate motions in this model are similar to
          those in Scotese (2004). Paleozoic plate motions are based on continental paleomagnetic data due to the
          absence of preserved seafloor spreading histories. Although paleomagnetic data on continents do not
          provide paleolongitudes, the relative plate motions and tectonic unity of two continental blocks can be
          inferred from commonalities in the apparent-polar wander (APW) paths (Van der Voo, 1990). If two or more
          continents share a similar APW path for a time period, then it can be inferred that these continents were
          joined for these times. In the ideal world such APW paths would coincide perfectly, but due to the
          inherent uncertainties and errors in paleomagnetic measurements, we assume that the clustering of
          paleopoles indicates a common tectonic history between two or more plates during Paleozoic times.
          Similarly, tectonic affinities can be deduced from the continuity of orogenic belts, sedimentary basins,
          volcanic provinces, biofacies and other large-scale features across presently isolated continents
          (Wegener, 1915). We assign absolute plate motions to Africa, as the base of our rotation hierarchy, for
          the Phanerozoic based on the smoothed APW spline path from Torsvik and Van der Voo (2002). All continents
          that moved independently in the absolute reference frame (i.e. relative to the spin axis) from the
          Golonka (2007) model were recalculated as equivalent relative rotations to a conjugate neighbouring plate,
          connected hierarchically in our plate circuit.
        </p>
        <p>
          Citation:
          <br />
          Wright, N., Zahirovic, S., Müller, R. D., and Seton, M.{' '}
          <a
            href="https://www.earthbyte.org/towards-community-driven-paleogeographic-reconstructions-integrating-open-access-paleogeographic-and-paleobiology-data-with-plate-tectonics/"
            target="_blank"
            rel="noreferrer"
          >
            Towards community-driven paleogeographic reconstructions: integrating open-access paleogeographic and
            paleobiology data with plate tectonics,
          </a>{' '}
          Biogeosciences, 10, 1529-1541, doi:10.5194/bg-10-1529-2013, 2013.
        </p>

        <h2>Torsvik&apos;s Model</h2>
        <p>Global_EB_410-0Ma_GK07_2016_v3_modPMAG_fixed_crossovers.rot</p>
        <p>
          Citation:
          <br />
          Torsvik, Trond H., et al.{' '}
          <a href="http://www.sciencedirect.com/science/article/pii/S0012825212000797" target="_blank" rel="noreferrer">
            &quot;Phanerozoic polar wander, palaeogeography and dynamics.&quot;
          </a>{' '}
          Earth-Science Reviews 114.3 (2012): 325-368.
        </p>

        <h2>PALEOMAP PaleoAtlas Model</h2>
        <p>
          The PALEOMAP PaleoAtlas for GPlates consists of 91 paleogeographic maps spanning the Phanerozoic and late
          Neoproterozoic.
        </p>
        <p>
          Reference:
          <br />
          <a href="https://www.earthbyte.org/paleomap-paleoatlas-for-gplates/" target="_blank" rel="noreferrer">
            PaleoAtlas_Scotese_v2
          </a>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
