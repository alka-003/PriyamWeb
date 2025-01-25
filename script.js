// Service Worker Registration
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("Service Worker registered"))
      .catch((err) => console.log("Service Worker not registered", err))
  }
  
  // DOM Elements
  const languageSelect = document.getElementById("language-select")
  const navButtons = document.querySelectorAll("nav button")
  const sections = document.querySelectorAll("main section")
  const documentForm = document.getElementById("document-form")
  const documentList = document.getElementById("document-list")
  const reminderForm = document.getElementById("reminder-form")
  const reminderList = document.getElementById("reminder-list")
  const quoteText = document.getElementById("quote-text")
  const centerList = document.getElementById("center-list")
  
  // Language translations
  const translations = {
    en: {
      documents: "Documents",
      calendar: "Calendar",
      reminders: "Reminders",
      quote: "Daily Quote",
      location: "Nearby Centers",
    },
    hi: {
      documents: "दस्तावेज़",
      calendar: "कैलेंडर",
      reminders: "रिमाइंडर",
      quote: "दैनिक उद्धरण",
      location: "निकटवर्ती केंद्र",
    },
    ml: {
      documents: "രേഖകൾ",
      calendar: "കലണ്ടർ",
      reminders: "ഓർമ്മപ്പെടുത്തലുകൾ",
      quote: "ദൈനംദിന ഉദ്ധരണി",
      location: "സമീപത്തുള്ള കേന്ദ്രങ്ങൾ",
    },
  }
  
  // Change language
  languageSelect.addEventListener("change", (e) => {
    const lang = e.target.value
    navButtons.forEach((btn) => {
      btn.textContent = translations[lang][btn.id.split("-")[0]]
    })
  })
  
  // Navigation
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sections.forEach((section) => section.classList.add("hidden"))
      document.getElementById(btn.id.split("-")[0]).classList.remove("hidden")
    })
  })
  
  // Document Storage
  documentForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const name = document.getElementById("doc-name").value
    const file = document.getElementById("doc-file").files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const documents = JSON.parse(localStorage.getItem("documents") || "[]")
      documents.push({ name, content: event.target.result })
      localStorage.setItem("documents", JSON.stringify(documents))
      displayDocuments()
    }
    reader.readAsDataURL(file)
  })
  
  function displayDocuments() {
    const documents = JSON.parse(localStorage.getItem("documents") || "[]")
    documentList.innerHTML = documents
      .map(
        (doc) => `
          <div class="document-item">
              <strong>${doc.name}</strong>
              <a href="${doc.content}" download="${doc.name}">Download</a>
          </div>
      `,
      )
      .join("")
  }
  
  // Calendar
  function displayCalendar() {
    const calendarContainer = document.getElementById("calendar-container")
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
  
    calendarContainer.innerHTML = ""
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div")
      dayElement.classList.add("calendar-day")
      dayElement.textContent = i
      calendarContainer.appendChild(dayElement)
    }
  }
  
  // Reminders
  reminderForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const text = document.getElementById("reminder-text").value
    const time = document.getElementById("reminder-time").value
    const reminders = JSON.parse(localStorage.getItem("reminders") || "[]")
    reminders.push({ text, time })
    localStorage.setItem("reminders", JSON.stringify(reminders))
    displayReminders()
  })
  
  function displayReminders() {
    const reminders = JSON.parse(localStorage.getItem("reminders") || "[]")
    reminderList.innerHTML = reminders
      .map(
        (reminder) => `
          <div class="reminder-item">
              <strong>${reminder.text}</strong>
              <span>${new Date(reminder.time).toLocaleString()}</span>
          </div>
      `,
      )
      .join("")
  }
  
  // Daily Quote
  function displayDailyQuote() {
    const quotes = [
      "കാലം കെടുത്താത്ത ഓർമ്മകളും അനുഭവങ്ങളും വൃദ്ധരുടെ വസുവരമാണ്.",
      "വയസ്സിന്‍റെ ചുളിവുകൾ ഹൃദയത്തിന്‍റെ അനുഭവങ്ങളാണ്.",
      "മനസ്സിന്‍റെ ചെറുപ്പം കാത്തുസൂക്ഷിക്കുന്നവർക്ക് വയസ്സ് വെറും എണ്ണം മാത്രമാണ്."
    ]
    quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)]
  }
  
  // Nearby Centers (Mock data)
  function displayNearbyCenters() {
    const centers = [
      { name: "Akshaya Center 1", address: "123 Main St, City" },
      { name: "Akshaya Center 2", address: "456 Oak St, City" },
      { name: "Akshaya Center 3", address: "789 Pine St, City" },
    ]
    centerList.innerHTML = centers
      .map(
        (center) => `
          <div class="center-item">
              <strong>${center.name}</strong>
              <p>${center.address}</p>
          </div>
      `,
      )
      .join("")
  }
  
  // Initial display
  displayDocuments()
  displayCalendar()
  displayReminders()
  displayDailyQuote()
  displayNearbyCenters()
  
  // Check and display reminders
  setInterval(() => {
    const reminders = JSON.parse(localStorage.getItem("reminders") || "[]")
    const now = new Date()
    reminders.forEach((reminder) => {
      if (new Date(reminder.time) <= now) {
        alert(`Reminder: ${reminder.text}`)
      }
    })
  }, 60000) // Check every minute
  
  function sendSOS() {
    const confirmRequest = confirm("Do you want to send an SOS alert to the hospital?");
    if (confirmRequest) {
        alert("SOS sent to the hospital! Help is on the way.");
        // Simulate an API call to notify the hospital
        fetch("https://hospital-api.example.com/alert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Emergency! Immediate assistance required.",
                location: "User's location (use GPS or input data)",
            })
        })
        .then(response => response.json())
        .then(data => console.log("Response from the hospital:", data))
        .catch(error => console.error("Error sending SOS:", error));
    }
}