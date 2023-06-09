import {useEffect, useState} from "react";
import {TimeoutWarningModal} from "./TimeoutWarningModal"
import { addEventListeners,  removeEventListeners } from './util/eventListenerUtil'
import { logout } from "./../firebase";

// https://www.vincentntang.com/session-timeout-modals-react/
// https://github.com/vincentntang/react-session-timeout-example
// https://stackoverflow.com/questions/60624694/log-a-user-out-of-a-website-when-they-put-their-computer-to-sleep
    
export const TimeoutLogic = () => { 
  const [isWarningModalOpen, setWarningModalOpen] = useState(false);
  const awayMinutes = 30;
  const modalDisplayMinutes = 5;
  const awayFromKeyboardPeriod = awayMinutes * 60 * 1000; // Fifteen minutes of user inactivity then modal opens.
  const modalDisplayPeriod = modalDisplayMinutes * 60 * 1000; // Five minutes before the modal closes and the user is logged out.

  const checkLocalStorage = () => {
    let lastActivity = localStorage.getItem('lastActvity');
    let lastActivityNumber = new Number(lastActivity).valueOf()
    var diffMs = Math.abs(lastActivityNumber - new Date().getTime()); // milliseconds between now & last activity
    var seconds = Math.floor((diffMs/1000));
    var minute = Math.floor((seconds/60));
    if(diffMs >= awayFromKeyboardPeriod + modalDisplayPeriod){
      logout();
      console.log('No activity from last ' + (awayMinutes + modalDisplayMinutes) + ' minutes... Logging Out');
    }
  }

  useEffect(() => {
    window.addEventListener('visibilitychange', checkLocalStorage, false);
    return () => {
      window.removeEventListener('visibilitychange', checkLocalStorage, false);
    }
  }, []);

  useEffect(() => {

    //after last user interation this session timeout starts
    const createTimeout1 = () => setTimeout(()=>{ 
      setWarningModalOpen(true);
    },awayFromKeyboardPeriod) 

    //Once modal is open this timeout clock starts
    const createTimeout2 = () => setTimeout(() => {
      // Implement a sign out function here
      logout();
    },modalDisplayPeriod) 

    const trackTotalTimeSinceActivity = () => {
      //Function only called if there has been user activity, safe to kill any existing timers
      clearTimeout(activityTimer);

      var lastActivityStart = Date.now();
      activityTimer = setInterval(function () {
        if (Date.now() - lastActivityStart > (awayFromKeyboardPeriod + modalDisplayPeriod)) {
          clearTimeout(activityTimer);
          logout();
        }
      }, 1000);
    }
    
    //called when there is user activity. Clears last timer and creates a new one
    const listener = () => {
      //any activity triggers master session time tracker to reset
      trackTotalTimeSinceActivity();

      if(!isWarningModalOpen){
        clearTimeout(timeout)
        timeout = createTimeout1();
      }

      //Backup plan: Javascript (timers) stops when browser closed, need to rely on localStorage always.
      //Reopening browser after timeout period will display the page but will log you out as
      //soon as you click on anything.
      checkLocalStorage();
      localStorage.setItem('lastActvity', Date.now().toString());
    } 

    // Initialization
    let timeout = isWarningModalOpen  ? createTimeout2() : createTimeout1()
    let activityTimer = null;
    addEventListeners(listener);

    // Cleanup
    return () => {
      removeEventListeners(listener);
      clearTimeout(timeout);
      clearTimeout(activityTimer);
    }
  },[isWarningModalOpen])
  return (
    <div>
      {isWarningModalOpen && (
        <TimeoutWarningModal 
          isOpen={isWarningModalOpen}
          onRequestClose={() => setWarningModalOpen(false)}
        />
        )
      }
    </div>
  ) 
}