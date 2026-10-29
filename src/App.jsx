import Hero from './components/Hero';
import About from './components/About';
import FAQs from './components/FAQs';
import Footer from './components/Footer';
import Timeline from "./components/Timeline";
import Themes from './components/Themes';
import Speakers from './components/Speakers';
import UpcomingEvents from './components/UpcomingEvents';
import Prizes from './components/Prizes';

// Temporary placeholders for sections teammates are building
const Stub = ({ id, label }) => (
  <section
    id={id}
    style={{
      minHeight: '60vh',
      display: 'grid',
      placeItems: 'center',
      color: '#8DAAFF',
      fontFamily: 'var(--mo)',
      fontSize: '12px',
    }}
  >
    {label}
  </section>
);

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Timeline />
        <Themes />
        <Stub id="events" label="Events (teammate)" />
        <Speakers />

        <UpcomingEvents />
        <Prizes />

        <Stub id="register" label="Registration (teammate)" />
        <FAQs />
      </main>

      <Footer />
    </>
  );
}
