import React, { useState, useEffect } from 'react';
import arrowLeft from '../assets/arrow-left.svg';
import downArrow from '../assets/down-arrow.svg';
import calendarIcon from '../assets/calendar.svg';
import timerIcon from '../assets/timer.svg';
import ProfileForm from '../components/ProfileForm';
// import { ChevronDownIcon, ClockIcon, CalendarIcon } from '@heroicons/react/outline';

interface AccountSettingsProps {
  onSave?: (settings: UserSettings) => void;
}

interface UserSettings {
  notification: {
    schedule: string;
  };
  reminder: {
    day: string;
    time: string;
  };
  theme: {
    darkMode: boolean;
    lightMode: boolean;
    systemMode: boolean;
  };
  sound: {
    volume: number;
  };
}

const Dashboard: React.FC<AccountSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<UserSettings>({
    notification: {
      schedule: 'Daily',
    },
    reminder: {
      day: 'Monday',
      time: '02:30pm GMT+1',
    },
    theme: {
      darkMode: true,
      lightMode: false,
      systemMode: false,
    },
    sound: {
      volume: 37,
    },
  });

  const [activeTab, setActiveTab] = useState('profile-settings');
  const [isChanged, setIsChanged] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Track changes to enable/disable save button
  useEffect(() => {
    setIsChanged(true);
  }, [settings]);

  const handleNotificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      notification: {
        ...settings.notification,
        schedule: e.target.value,
      },
    });
  };

  const handleReminderDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      reminder: {
        ...settings.reminder,
        day: e.target.value,
      },
    });
  };

  const handleReminderTimeChange = (time: string) => {
    setSettings({
      ...settings,
      reminder: {
        ...settings.reminder,
        time: time,
      },
    });
  };

  const handleThemeToggle = (theme: 'darkMode' | 'lightMode' | 'systemMode') => {
    // Create a new theme object with all modes set to false
    const newTheme = {
      darkMode: false,
      lightMode: false,
      systemMode: false,
    };

    // Set the selected theme to true
    newTheme[theme] = true;

    setSettings({
      ...settings,
      theme: newTheme,
    });

    // Get the root div element
    const rootDiv = document.getElementById('root');
    const mainElement = document.querySelector('main');

    if (theme === 'lightMode') {
      document.body.style.backgroundColor = '#FFFFFF';
      if (rootDiv) rootDiv.style.backgroundColor = '#FFFFFF';
      if (mainElement) {
        mainElement.style.backgroundColor = '#FFFFFF';
        mainElement.style.color = '#000000';
      }
    } else if (theme === 'darkMode') {
      document.body.style.backgroundColor = '#121212';
      if (rootDiv) rootDiv.style.backgroundColor = '#121212';
      if (mainElement) {
        mainElement.style.backgroundColor = '#121212';
        mainElement.style.color = '#757575';
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      sound: {
        ...settings.sound,
        volume: parseInt(e.target.value),
      },
    });
  };

  const handleOptionClick = (value: string) => {
    setSettings({
      ...settings,
      notification: {
        ...settings.notification,
        schedule: value
      }
    });
    setIsDropdownOpen(false);
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    if (onSave) {
      onSave(settings);
    }
    setIsChanged(false);
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-200 ${settings.theme.lightMode ? 'bg-white text-black' : 'bg-[#121212] text-gray-300'
      }`}>
      {/* Header */}
      <header className={`p-4 border-b flex flex-col md:flex-row items-center justify-between transition-colors duration-200 ${settings.theme.lightMode
        ? 'bg-white border-gray-200 text-black'
        : 'bg-[#121212] border-gray-800'
        }`}>
        {/* Title - responsive padding */}
        <h1 className="text-[#0A746D] text-[28px] md:text-[36px] px-4 md:pl-8 lg:pl-52 mb-4 md:mb-0">
          Setting
        </h1>

        {/* Navigation - make it scrollable on small screens */}
        <nav className="flex space-x-4 md:space-x-6 items-center w-full md:w-auto overflow-x-auto 
          md:absolute md:left-1/2 md:transform md:-translate-x-1/2"
          aria-label="Settings Navigation">
          <button
            className={`px-2 pb-2 whitespace-nowrap ${activeTab === 'profile-settings' ? 'text-white text-[15px] md:text-[17px] border-b-2 border-[#F9BC07]' : 'text-gray-400'
              }`}
            onClick={() => setActiveTab('profile-settings')}
            aria-selected={activeTab === 'profile-settings'}
            role="tab"
          >
            Profile
          </button>
          <button
            className={`px-2 pb-2 ${activeTab === 'account-settings' ? 'text-[#F9BC07] border-b-2 text-[17px] border-[#F9BC07]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('account-settings')}
            aria-selected={activeTab === 'account-settings'}
            role="tab"
          >
            Account
          </button>
          <button
            className={`px-2 pb-2 ${activeTab === 'game-settings' ? 'text-white border-b-2 border-[#F9BC07] text-[17px]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('game-settings')}
            aria-selected={activeTab === 'game-settings'}
            role="tab"
          >
            Game setting
          </button>
        </nav>

        {/* Back button - responsive padding */}
        <div className="flex items-center px-4 md:pr-8 lg:pr-52 gap-2 mt-4 md:mt-0">
          <img src={arrowLeft} alt="Back" className="w-5 h-5" />
          <span className="text-[#757575] text-[18px] md:text-[23px]">BACK</span>
        </div>
      </header>

      {/* Main Content */}
      <main className={`p-4 md:p-6 max-w-3xl mx-auto transition-colors duration-200 ${settings.theme.lightMode ? 'bg-white' : 'bg-[#121212]'
        }`}>

        <div id='profile-settings'>
          <ProfileForm />
        </div>

        <div id='account-settings' className="flex flex-col">
          {/* Notification Section */}
          <section className="mb-6 px-4 md:px-0" aria-labelledby="notification-title">
            <h2 id="notification-title" className={`text-[24px] md:text-[28px] mb-1 ${settings.theme.lightMode ? 'text-black' : 'text-[#CFFDED]'
              }`}>
              Notification
            </h2>
            <p className="text-[14px] text-[#757575] mb-3">Notification Schedule</p>
            <div className="relative">
              <div className="flex items-center justify-between border-b border-gray-800 py-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span className="text-sm">{settings.notification.schedule}</span>
                <img
                  src={downArrow}
                  alt="Down Arrow"
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#1E1E1E] border border-gray-700 rounded-md shadow-lg">
                  <div className="py-1 text-[#757575] text-[14px]">
                    {['Daily', 'Weekly', 'Monthly', 'Never'].map((option) => (
                      <div
                        key={option}
                        className={`px-4 py-2  cursor-pointer hover:bg-gray-700 ${settings.notification.schedule === option ? 'text-[#F9BC07]' : 'text-gray-300'
                          }`}
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Reminder Section */}
          <section className="mb-6 px-4 md:px-0" aria-labelledby="reminder-title">
            <h2 id="reminder-title" className={`text-[24px] md:text-[28px] mb-1 ${settings.theme.lightMode ? 'text-black' : 'text-[#CFFDED]'
              }`}>
              Reminder Me
            </h2>
            <p className="text-[14px] text-[#757575] mb-3">Notification Schedule</p>

            <div className="space-y-4">
              {/* Day Selection */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">

                  <span className="text-[#757575] text-[14px]">Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#757575] text-[14px]">{settings.reminder.day}</span>
                  <img src={calendarIcon} alt="Calendar" className="cursor-pointer" />
                </div>
              </div>

              {/* Time Selection */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">

                  <span className="text-[#717171] text-[14px]">Time</span>
                </div>
                <div className="flex items-center gap-2">

                  <span className="text-[#717171] text-[14px]">{settings.reminder.time}</span>

                  <img
                    src={timerIcon} alt="Timer"
                    className="cursor-pointer text-[#717171] text-[15px]"
                    onClick={() => {
                      const newTime = settings.reminder.time === '02:30pm GMT+1' ?
                        '04:00pm GMT+1' : '02:30pm GMT+1';
                      handleReminderTimeChange(newTime);
                    }}
                  />
                </div>
              </div>

              {/* Day Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#1E1E1E] border border-gray-700 rounded-md shadow-lg">
                  <div className="py-1">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div
                        key={day}
                        className={`px-4 py-2 text-sm cursor-pointer text-[#717171] text-[15px] hover:bg-gray-700 ${settings.reminder.day === day ? 'text-[#F9BC07]' : 'text-[#717171]'
                          }`}
                        onClick={() => {
                          setSettings({
                            ...settings,
                            reminder: { ...settings.reminder, day }
                          });
                          setIsDropdownOpen(false);
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Theme Section */}
          <section className="mb-6 px-4 md:px-0" aria-labelledby="theme-title">
            <h2 id="theme-title" className={`text-[24px] md:text-[28px] mb-1 ${settings.theme.lightMode ? 'text-black' : 'text-[#CFFDED]'
              }`}>
              Theme
            </h2>
            <p className="text-[14px] text-[#757575] mb-3">Notification Schedule</p>

            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex justify-between items-center">
                <label htmlFor="dark-mode-toggle" className="text-[#757575] text-[14px]">Dark Mode</label>
                <button
                  id="dark-mode-toggle"
                  role="switch"
                  aria-checked={settings.theme.darkMode}
                  className={`relative w-12 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F9BC07] ${settings.theme.darkMode ? 'bg-[#F9BC07]' : 'bg-[#1E1E1E]'}`}
                  onClick={() => handleThemeToggle('darkMode')}
                >
                  <span className="sr-only">Enable Dark Mode</span>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${settings.theme.darkMode ? 'transform translate-x-6' : ''}`}
                    aria-hidden="true"
                  ></span>
                </button>
              </div>

              {/* Light Mode Toggle */}
              <div className="flex justify-between items-center">
                <label htmlFor="light-mode-toggle" className="text-[#757575] text-[14px]">Light Mode</label>
                <button
                  id="light-mode-toggle"
                  role="switch"
                  aria-checked={settings.theme.lightMode}
                  className={`relative w-12 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F9BC07] ${settings.theme.lightMode ? 'bg-[#F9BC07]' : 'bg-[#1E1E1E]'}`}
                  onClick={() => handleThemeToggle('lightMode')}
                >
                  <span className="sr-only">Enable Light Mode</span>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${settings.theme.lightMode ? 'transform translate-x-6' : ''}`}
                    aria-hidden="true"
                  ></span>
                </button>
              </div>

              {/* System Mode Toggle */}
              <div className="flex justify-between items-center">
                <label htmlFor="system-mode-toggle" className="text-[#757575] text-[14px]">System Mode</label>
                <button
                  id="system-mode-toggle"
                  role="switch"
                  aria-checked={settings.theme.systemMode}
                  className={`relative w-12 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F9BC07] ${settings.theme.systemMode ? 'bg-[#F9BC07]' : 'bg-[#1E1E1E]'}`}
                  onClick={() => handleThemeToggle('systemMode')}
                >
                  <span className="sr-only">Enable System Mode</span>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${settings.theme.systemMode ? 'transform translate-x-6' : ''}`}
                    aria-hidden="true"
                  ></span>
                </button>
              </div>
            </div>
          </section>

          {/* Sound Section */}
          <section className="mb-6 px-4 md:px-0" aria-labelledby="sound-title">
            <h2 id="sound-title" className={`text-[24px] md:text-[28px] mb-4 ${settings.theme.lightMode ? 'text-black' : 'text-[#CFFDED]'
              }`}>
              Sound
            </h2>

            <div className="flex flex-col">
              <label htmlFor="volume-slider" className="text-[#757575] text-[14px] mb-2">Volume</label>
              <div className="flex items-center">
                <div className="flex-1 mr-4 ">
                  <input
                    id="volume-slider"
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sound.volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 appearance-none bg-gray-700 rounded cursor-pointer focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, #717171 ${settings.sound.volume}%, #374151 ${settings.sound.volume}%)`
                    }}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={settings.sound.volume}
                  />
                </div>
                <span className="text-sm min-w-[40px] text-right" aria-hidden="true">{settings.sound.volume}%</span>
              </div>
            </div>
          </section>

          {/* Account Deletion Section - make it responsive */}
          <div className="flex flex-col px-4 md:px-0">
            <div className="w-full">
              <h1 className="text-[24px] md:text-[28px] text-[#CFFDED] font-bold mb-4">
                Account Deletion Information
              </h1>
              <p className="mb-2 text-[12px] md:text-[13px]">
                If you are considering deleting your LogQuest account, please take a moment to read the following important information
                <li className="pt-4">Permanent Action: Deleting your account is a permanent action. Once deleted, you will lose access to your account, including all your game progress, scores, and any purchased items and coin.</li>
              </p>
              <ul className="list-disc list-inside text-[12px] md:text-[13px] mb-4">
                <li>Data Removal: All personal information associated with your account will be permanently removed. This includes your username, email address, and any related gameplay data.</li>
              </ul>
              <h2 className="text-[24px] md:text-[28px] text-[#CFFDED] font-semibold mb-2">
                Need Help?
              </h2>
              <p className="mb-4 text-[12px] md:text-[13px]">
                If you have any questions or need assistance, please feel free to contact our support team at support@logquest.com We value your feedback and are here to help!
              </p>
              <button className="w-full md:w-[138px] h-[47px] bg-[#DC3B08] text-[13px] hover:bg-red-700 text-white font-bold py-2 rounded-[5px]">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div id='game-settings'></div>
      </main>
    </div>
  );
};

export default Dashboard; 