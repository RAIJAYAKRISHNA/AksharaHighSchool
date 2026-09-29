import logo from "../../assets/logo/akshara-logo.png";
import Button from "../common/Button.jsx";
import { schoolInfo } from "../../data/schoolData.js";

function Hero() {
    return (
        <section className="hero" aria-labelledby="hero-title">
            <div className="container hero__inner">
                <div className="hero__content">
                    <span className="hero__eyebrow">Nursery to Class 10</span>
                    <h1 id="hero-title" className="hero__title">
                        <span className="hero__school">{schoolInfo.name}</span>
                        {schoolInfo.tagline}
                    </h1>
                    <p className="hero__text">{schoolInfo.description}</p>
                    <div className="btn-group">
                        <Button to="/about" variant="light" size="lg">
                            Explore Our School
                        </Button>
                        <Button to="/admissions" variant="secondary" size="lg">
                            Enquire Now
                        </Button>
                    </div>
                </div>

                <div className="hero__visual">
                    <div className="hero__card">
                        <img
                            src={logo}
                            alt={`${schoolInfo.name} logo`}
                            className="hero__logo"
                        />
                        <p className="hero__caption">Learning that grows with your child</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;