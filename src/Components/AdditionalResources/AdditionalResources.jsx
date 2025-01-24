import "./AdditionalResources.css";

const AdditionalResources = () => {
return (
    <>
        <div className="settings-subsection-header">
            <h4>Accessibility and Display</h4>
        </div>
        <p className="greyed-text settings-sub-page-sub-text">
            Check out other places for helpful information to learn more about X
            products and services.
        </p>
        <div className="additional-resources-page-details">
            <h3 className="sub-heading-additional-resources-page">Release notes</h3>
            <a href="https://x.com/i/release_notes" target="_blank" className="additional-resource-link-row">
                <p>Release Notes</p>
                <button>↗</button>
            </a>
            <hr className="default-grey-line" />

            <h3 className="sub-heading-additional-resources-page">Legal info</h3>
            <a href="https://business.x.com/en/help/troubleshooting/how-x-ads-work" target="_blank" className="additional-resource-link-row">
                <p>Ads info</p>
                <button>↗</button>
            </a>
            <a href="https://help.x.com/en/rules-and-policies/x-cookies" target="_blank" className="additional-resource-link-row">
                <p>Cookie Policy</p>
                <button>↗</button>
            </a>
            <a href="https://x.com/en/privacy" target="_blank" className="additional-resource-link-row">
                <p>Privacy Policy</p>
                <button>↗</button>
            </a>
            <a href="https://x.com/en/tos" target="_blank" className="additional-resource-link-row">
                <p>Terms of Service</p>
                <button>↗</button>
            </a>
            <hr className="default-grey-line" />

            <h3 className="sub-heading-additional-resources-page">Miscellaneous</h3>
            <a href="https://about.x.com/en" target="_blank" className="additional-resource-link-row">
                <p>About</p>
                <button>↗</button>
            </a>
            <a href="https://help.x.com/en/resources/accessibility" target="_blank" className="additional-resource-link-row">
                <p>Accessibility</p>
                <button>↗</button>
            </a>
            <a href="https://ads.x.com/onboarding/18ce55r06or/welcome?ref=gl-tw-tw-twitter-advertise" target="_blank" className="additional-resource-link-row">
                <p>Advertising</p>
                <button>↗</button>
            </a>
            <a href="https://blog.x.com/" target="_blank" className="additional-resource-link-row">
                <p>Blog</p>
                <button>↗</button>
            </a>
        </div>
    </>
);
};

export default AdditionalResources;
