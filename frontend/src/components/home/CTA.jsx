import Button from "../common/Button.jsx";
import SectionTitle from "../common/SectionTitle.jsx";

function CTA() {
    return (
        <section className="section section--primary">
            <div className="container">
                <SectionTitle
                    light
                    title="Give Your Child a Strong Foundation for Tomorrow."
                    subtitle="Talk to us about admissions and see how Akshara can support your child's learning journey."
                />
                <div className="btn-group btn-group--center">
                    <Button to="/admissions" variant="secondary" size="lg">
                        Enquire Now
                    </Button>
                    <Button to="/contact" variant="outline-light" size="lg">
                        Contact Us
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default CTA;