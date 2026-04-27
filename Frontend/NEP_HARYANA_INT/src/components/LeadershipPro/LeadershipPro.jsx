import React from 'react';
import styles from './LeadershipPro.module.css';
import governorImg from '../../assets/haryana-governor.jpg';
import cmImg from '../../assets/haryana-cm.jpg';

const leaders = [
  {
    id: 'governor',
    name: 'Prof. Ashim Kumar Gosh',
    title: 'Governor, State of Haryana',
    designation: 'Patron, Haryana State Higher Education Council',
    photo: governorImg,
    messageTitle: 'Message from the Governor',
    message: `It gives me immense pride to witness the transformative journey of higher education in Haryana under the visionary framework of the National Education Policy 2020. Quality education is the cornerstone of a progressive society, and digital platforms such as ShikshaSetu represent a paradigm shift in how we govern, evaluate, and elevate our academic institutions. By bringing transparency, accountability, and data-driven governance to every college across the state, we are building an ecosystem where excellence is not an aspiration but a standard. I earnestly encourage all institutions of higher learning in Haryana to actively embrace this platform for the collective betterment of our students and the academic ecosystem of our great state.`,
    closing: 'With best wishes,',
  },
  {
    id: 'chief-minister',
    name: 'Shri Nayab Singh Saini',
    title: 'Chief Minister, Government of Haryana',
    designation: 'Chairperson, Haryana State Higher Education Council',
    photo: cmImg,
    messageTitle: 'Message from the Hon\'ble Chief Minister',
    message: `Our government is firmly committed to modernizing higher education infrastructure and empowering every institution across all 22 districts of Haryana with the tools they need to thrive in the 21st century. ShikshaSetu is not merely a portal — it is a flagship digital initiative under NEP 2020 that ensures equitable access to schemes, streamlines accreditation processes, and enables data-driven evaluation at an unprecedented scale. Through this platform, we are bridging the gap between policy and implementation, ensuring that every college — whether in Gurugram or Nuh — has equal opportunity to excel. I personally endorse ShikshaSetu as a transformative step towards building a future-ready Haryana.`,
    closing: 'Jai Hind, Jai Haryana,',
  },
];

function LeadershipPro() {
  return (
    <section className={styles.section} id="leadership-section" aria-label="Leadership Messages">
      {/* Section Header */}
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.accentLine} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>Messages from Leadership</h2>
          <p className={styles.sectionSubtitle}>
            Guiding Haryana's Higher Education Transformation
          </p>
        </div>

        {/* Leadership Cards Grid */}
        <div className={styles.gridContainer}>
          {leaders.map((leader) => (
            <div key={leader.id} className={styles.card}>
              
              <div className={styles.cardTop}>
                <div className={styles.portraitFrame}>
                  <img
                    src={leader.photo}
                    alt={`Official portrait of ${leader.name}`}
                    className={styles.portraitImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.identityBlock}>
                  <h3 className={styles.leaderName}>{leader.name}</h3>
                  <p className={styles.leaderTitle}>{leader.title}</p>
                  <p className={styles.leaderDesignation}>{leader.designation}</p>
                </div>
              </div>

              <div className={styles.cardBottom}>
                <span className={styles.quoteDecor} aria-hidden="true">"</span>
                <h4 className={styles.messageHeading}>{leader.messageTitle}</h4>
                <p className={styles.messageText}>{leader.message}</p>
                
                <div className={styles.messageClosing}>
                  <span className={styles.closingText}>{leader.closing}</span>
                  <span className={styles.closingName}>{leader.name}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative Bottom Pattern */}
      <div className={styles.bottomDivider} aria-hidden="true" />
    </section>
  );
}

export default LeadershipPro;
