async function fetchJobDescription(title) {
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
    title
  )}&num_pages=1`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "6cbd098126msh65c81672cd54569p10bfb2jsna2d10bcfd668",
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const description = data.data[0]?.job_description || "No description found";
    console.log(description);
    return description;
  } catch (error) {
    console.error("Error fetching job description:", error);
    return "Error fetching job description";
  }
}

// button no sound banavva mate
gsap.utils.toArray(".btnClick").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" });
  });
  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
  });
  btn.addEventListener("mousedown", () => {
    gsap.to(btn, { scale: 0.95, duration: 0.1 });
  });
  btn.addEventListener("mouseup", () => {
    gsap.to(btn, { scale: 1.05, duration: 0.1 });
  });
});

const clickSound = new Howl({
  src: ["https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3"],
});

// khabar nai sena mate GASP animation mate
document.addEventListener("DOMContentLoaded", () => {
  const gradTexts = document.querySelectorAll(".gradient-text");
  gradTexts.forEach((el) => {
    el.style.visibility = "visible";
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1 });
  });
});

//GSAP Animation matenu

window.addEventListener("DOMContentLoaded", () => {
  gsap.from(".glass-container", {
    y: 50,
    opacity: 0,
    duration: 1.4,
    ease: "power4.out",
  });
});

// Email Automatioon send mate
function sendResumePDF() {
  const resumeContent = document.getElementById("resumePreview").innerText;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("Helvetica", "normal");
  const lines = doc.splitTextToSize(resumeContent, 180); // wrap text
  doc.text(lines, 10, 10);

  const pdfBlob = doc.output("blob");

  sendPDFToEmail(pdfBlob);
}

function sendPDFToEmail(pdfBlob) {
  const reader = new FileReader();
  reader.onload = function () {
    const base64PDF = reader.result.split(",")[1];
    const email = document.getElementById("userEmail").value;

    if (!email) {
      alert("Please enter your email before sending.");
      return;
    }

    emailjs
      .send("service_gf3lkj9", "your_template_id", {
        to_email: email,
        attachment: base64PDF,
        message:
          "Your resume PDF is attached. Thank you for using our resume builder!",
      })
      .then(() => {
        alert("✅ Email sent successfully!");
      })
      .catch((err) => {
        console.error("Email sending error:", err);
        alert("❌ Failed to send email.");
      });
  };

  reader.readAsDataURL(pdfBlob);
}

async function handleJobTitle() {
  const title = document.getElementById("jobTitleInput").value;
  const description = await fetchJobDescription(title);
  document.getElementById("jobDescriptionOutput").innerText = description;
}

// mannually description nakhva mate nu function

function proceedToResume() {
  // Setup sound (this can go near top of JS file)

  clickSound.play(); // 🔊 Sound plays on click
  const title = document.getElementById("manualJobTitle").value.trim();
  const location = document.getElementById("jobLocationInput").value.trim();
  const description = document
    .getElementById("manualJobDescription")
    .value.trim();

  if (!title || !location || !description) {
    alert("Please fill in all fields: job title, location, and description.");
    return;
  }

  // Store or pass these to the resume generator (Step 4)
  console.log("Title:", title);
  console.log("Location:", location);
  console.log("Description:", description);

  // We'll use these in the resume builder page or section
  alert("✅ Job posting captured. Now generating the resume...");

  // Optional: Store in localStorage for use on next page
  localStorage.setItem("jobTitle", title);
  localStorage.setItem("jobLocation", location);
  localStorage.setItem("jobDescription", description);

  // Next step: Show resume or go to another page
  generateResume({ title, location, description });
}
// experience generate karva mate

async function generateExperience() {
  const description = document.getElementById("jobDescription").value;
  const location = document.getElementById("jobLocation").value;
  const level = document.getElementById("experienceLevel").value;
  const count = document.getElementById("experienceCount").value;

  if (!description || !location) {
    alert("Please fill in job description and location");
    return;
  }

  const prompt = `
  Extract the job title and skills from the following job description, and generate ${count} job experience section(s) for a ${level}-level candidate in ${location}. 
  Use realistic Canadian companies. Include modern bullet points with quantifiable outcomes and use resume-friendly formatting.
  
  Job Description:
  ${description}
    `;

  const response = await fetch("/api/generate-experience", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  document.getElementById("experienceOutput").innerText = data.output;
}

// Resume generation karva mate aa function banavyu che
// function generateResume({ title, location, description }) {
//   const keywords = extractKeywords(description);
//   const expData = generateDynamicExperience(title, location);

//   document.getElementById("resumePreview").innerHTML = `
//       <div class="resume">
//         <h1>Meet Kumar Patel</h1>
//         <p><strong>${title}</strong> • ${location}</p>

//         <h3>Professional Summary</h3>
//         <p>Experienced and results-driven ${title} with a strong background in delivering high-quality solutions. Seeking to leverage skills in a dynamic company in ${location}.</p>

//         <h3>Key Skills</h3>
//         <ul>
//           ${keywords
//             .slice(0, 6)
//             .map((skill) => `<li>${skill}</li>`)
//             .join("")}
//         </ul>

//         <h3>Experience</h3>
//         <p><strong>${expData.company}</strong> — ${title} (${
//     expData.yearStart
//   } – ${expData.yearEnd})</p>
//         <ul>
//           ${expData.bullets.map((point) => `<li>${point}</li>`).join("")}
//         </ul>

//         <h3>Education</h3>
//         <p>Your Degree, College Name, Year</p>
//       </div>
//     `;

//   document.getElementById("resumeSection").style.display = "block";
// }

function generateResume({ title, location, description }) {
  const keywords = extractKeywords(description);
  const expData = generateDynamicExperience(title, location);
  const extractedExp = extractExperienceRequired(description);
  const manualExp = document.getElementById("manualExp")?.value;
  const requiredExp = manualExp || extractedExp;

  document.getElementById("resumePreview").innerHTML = `
    <div class="resume">
      <h1>Meet Kumar Patel</h1>
      <p><strong>${title}</strong> • ${location}</p>
      <p><strong>${requiredExp}</strong></p>

  
      <h3>Professional Summary</h3>
      <p>Experienced and results-driven ${title} with a strong background in delivering high-quality solutions. Seeking to leverage skills in a dynamic company in ${location}.</p>
  
      <h3>Key Skills</h3>
      <ul>
        ${keywords
          .slice(0, 6)
          .map((skill) => `<li>${skill}</li>`)
          .join("")}
      </ul>
  
      <h3>Experience</h3>
      <p><strong>${expData.company}</strong> — ${title} (${
    expData.yearStart
  } – ${expData.yearEnd})</p>
      <ul>
        ${expData.bullets.map((point) => `<li>${point}</li>`).join("")}
      </ul>
  
      <h3>Education</h3>
      <p>Diploma - Computer Programming, Conestoga College, 2024</p>
    </div>
  `;

  document.getElementById("resumeSection").style.display = "block";
}

// Utility to extract simple keywords
function extractKeywords(text) {
  const possibleSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "HTML",
    "CSS",
    "communication",
    "leadership",
    "project management",
    "teamwork",
    "customer service",
    "REST API",
    "Scrum",
    "Agile",
    "debugging",
    "Git",
    "Excel",
    "data analysis",
    "attention to detail",
  ];

  const textLower = text.toLowerCase();
  return possibleSkills.filter((skill) =>
    textLower.includes(skill.toLowerCase())
  );
}

// NAvu function required experience
function extractExperienceRequired(text) {
  const patterns = [
    /\b(\d{1,2})\+?\s*(?:years?|yrs?)\s+of\s+experience\b/i,
    /\bminimum\s+of\s+(\d{1,2})\s+years\b/i,
    /\bat\s+least\s+(\d{1,2})\s+years\b/i,
    /\b(\d{1,2})\s+years\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return `${match[1]} years experience required`;
  }

  // If nothing found, return a nicer fallback
  return "Experience requirement not specified";
}

function generateDynamicExperience(title, location = "") {
  const role = title.toLowerCase();

  // Helper to get random integer between min and max (inclusive)
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Predefined company examples by country (can expand later)
  const companiesByCountry = {
    canada: [
      "MapleTech Solutions",
      "Northern Innovations",
      "TrueNorth Labs",
      "CanTech Corp",
    ],
    usa: [
      "NextGen Softwares",
      "Pioneer Apps",
      "BlueWave Tech",
      "Innovatech LLC",
    ],
    uk: ["BritSoft Solutions", "CrownTech", "Union IT Services", "London Labs"],
    default: [
      "Global Tech",
      "Dynamic Solutions",
      "Innovatech Group",
      "TechSphere",
    ],
  };

  // Pick companies based on location country keyword, fallback to default
  let companyPool = companiesByCountry.default;
  if (location.toLowerCase().includes("canada"))
    companyPool = companiesByCountry.canada;
  else if (
    location.toLowerCase().includes("usa") ||
    location.toLowerCase().includes("united states")
  )
    companyPool = companiesByCountry.usa;
  else if (
    location.toLowerCase().includes("uk") ||
    location.toLowerCase().includes("united kingdom")
  )
    companyPool = companiesByCountry.uk;

  // Pick a random company from pool
  const company = companyPool[randInt(0, companyPool.length - 1)];

  // Date range - last 3 years to present
  const yearStart = new Date().getFullYear() - randInt(1, 3);
  const yearEnd = "Present";

  // Sample bullets by role category with variables and metrics
  if (
    role.includes("web developer") ||
    role.includes("frontend") ||
    role.includes("developer")
  ) {
    const bullets = [
      `Built responsive UI components using React.js and Tailwind CSS for enterprise SaaS applications.`,
      `Improved application load speed by ${randInt(
        20,
        50
      )}% through code optimization and lazy loading.`,
      `Mentored ${randInt(
        1,
        5
      )} junior developers, increasing team productivity by ${randInt(
        10,
        25
      )}%.`,
      `Collaborated with backend teams to integrate RESTful APIs, reducing data fetch latency by ${randInt(
        15,
        30
      )}%.`,
      `Implemented automated testing pipelines using Jest and Cypress, increasing code coverage to over 85%.`,
    ];
    return { company, yearStart, yearEnd, bullets };
  }

  if (role.includes("project manager")) {
    const bullets = [
      `Led cross-functional teams of ${randInt(
        5,
        15
      )} members to deliver projects on time and within budget.`,
      `Created detailed project timelines and managed resources effectively, improving delivery speed by ${randInt(
        10,
        20
      )}%.`,
      `Coordinated agile ceremonies including sprint planning and retrospectives with a focus on continuous improvement.`,
      `Tracked milestones and reported progress to stakeholders, enhancing transparency and decision-making.`,
      `Implemented risk mitigation strategies that reduced project delays by ${randInt(
        20,
        40
      )}%.`,
    ];
    return { company, yearStart, yearEnd, bullets };
  }

  if (role.includes("data analyst") || role.includes("data scientist")) {
    const bullets = [
      `Analyzed large datasets using Python and SQL, delivering actionable insights that increased sales by ${randInt(
        10,
        30
      )}%.`,
      `Developed dashboards with Tableau and Power BI to visualize key business metrics for stakeholders.`,
      `Automated data cleaning processes, reducing manual effort by ${randInt(
        30,
        50
      )}%.`,
      `Collaborated with cross-functional teams to support data-driven decision-making.`,
      `Designed and implemented predictive models that improved customer retention by ${randInt(
        15,
        25
      )}%.`,
    ];
    return { company, yearStart, yearEnd, bullets };
  }

  // Default fallback experience
  return {
    company,
    yearStart,
    yearEnd,
    bullets: [
      `Performed key responsibilities associated with the ${title} role.`,
      `Collaborated with team members to achieve organizational goals.`,
      `Demonstrated adaptability and problem-solving in a fast-paced environment.`,
    ],
  };
}

app.post("/api/generate-experience", async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  res.json({ output: completion.choices[0].message.content });
});

// resume copy karva nu che aa ma thi

function copyResume() {
  const resumeText = document.getElementById("resumePreview").innerText;
  navigator.clipboard
    .writeText(resumeText)
    .then(() => {
      document.getElementById("exportStatus").innerText =
        "✅ Resume copied to clipboard!";
    })
    .catch((err) => {
      document.getElementById("exportStatus").innerText =
        "❌ Failed to copy resume.";
    });
}

// download karva mate aa resume
function downloadResume(format) {
  const resumeText = document.getElementById("resumePreview").innerText;
  const blob = new Blob([resumeText], {
    type: format === "doc" ? "application/msword" : "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `resume.${format}`;
  link.click();
  URL.revokeObjectURL(url);
  document.getElementById(
    "exportStatus"
  ).innerText = `✅ Resume downloaded as .${format}`;
}

// Download karva mate as a pdf format in laptop
function DownloadPDF() {
  const resume = document.getElementById("resumePreview").innerHTML;
  const resumeWindow = window.open("", "_blank");
  resumeWindow.document.write(`
      <html>
        <head>
          <title>Resume - Meet Kumar Patel</title>
          <style>
            ${document.querySelector("style")?.innerHTML || ""}
          </style>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <div class="resume">${resume}</div>
        </body>
      </html>
    `);
  resumeWindow.document.close();
  resumeWindow.focus();
  resumeWindow.print();
}

const buttonSound = new Howl({
  src: ["https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3"],
});

document.querySelectorAll(".btnClick").forEach((btn) => {
  btn.addEventListener("click", () => buttonSound.play());
});

