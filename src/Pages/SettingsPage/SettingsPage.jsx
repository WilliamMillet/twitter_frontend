import './SettingsPage.css'
import StandardLayout from "../../Components/StandardLayout/StandardLayout";
import StandardOptions from '../../Components/StandardOptions/StandardOptions';
import { useState } from 'react';
import YourAccountOptions from '../../Components/YourAccountOptions/YourAccountOptions';
import PrivacyAndSaftey from '../../Components/PrivacyAndSaftey/PrivacyAndSaftey';
import AccessibilityAndDisplay from '../../Components/AccessibilityAndDisplay/AccessibilityAndDisplay';
import AdditionalResources from '../../Components/AdditionalResources/AdditionalResources';

const SettingsPage = () => {
    
      const [selectedOption, setSelectedOption] = useState('Your account')
      const options = ['Your account', 'Accessibility and display', 'Additional Resources', 'Notifications', 'Privacy and Saftey']
      const borders = [false, true, false]

        

    return ( 
        <StandardLayout extendedVersion={true}>
          <section className='settings-section'>
          <div className="settings-primary-categories">
          <h4 className="settings-name-title">Settings</h4>
            <StandardOptions 
            options={options}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            defaultOption="Your account"
            borders={[true, false, false]}
            highlightSelect={true}
            vertical={true}
            boldSelect={false}
            colorInactiveOptionsGrey={false}
            optionHeight='large'
            textAlign='left'
            rightArrow={true}
            />  
          </div>
          <div className="settings-real-options">
          {selectedOption === 'Your account' && <YourAccountOptions/>}
          {selectedOption === 'Privacy and Saftey' && <PrivacyAndSaftey/>}
          {selectedOption === 'Accessibility and display' && <AccessibilityAndDisplay/>}
          {selectedOption === 'Additional Resources' && <AdditionalResources/>}
          </div>
          </section>
        </StandardLayout>
     );
}
 
export default SettingsPage;