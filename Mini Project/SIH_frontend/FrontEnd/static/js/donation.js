document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired (Rewritten with all functions).");

  // DOM Elements
  const customAmountInput = document.getElementById("donation_amount");
  const donationCards = document.querySelectorAll(".donation-card");
  const amountOptions = document.querySelectorAll(".amount-option");
  const donorNameInput = document.getElementById("donor_name");
  const donorEmailInput = document.getElementById("donor_email");
  const donorPhoneInput = document.getElementById("donor_phone");
  const donorMessageInput = document.getElementById("donor_message");
  const anonymousCheckbox = document.getElementById("anonymous-donation");
  const recurringCheckbox = document.getElementById("recurring-donation");
  const donateButton = document.getElementById("donate-button");
  const selectedFundName = document.getElementById("selected-fund-name");
  const selectedFundDescription = document.getElementById("selected-fund-description");
  const toastBox = document.getElementById("toastBox");
  const currencySymbol = document.querySelector(".currency-symbol");

  // State variables
  let selectedFund = "general";
  let selectedAmount = 0;
  let isAnonymous = false;
  let isRecurring = false;
  let isMoneyDonation = false;

  // Fund Descriptions (assuming you have these)
  const fundDescriptions = {
    scholarship: "Help deserving students achieve their educational goals by contributing to our scholarship fund.",
    infrastructure: "Support the improvement and expansion of campus facilities to enhance the learning environment.",
    research: "Fund innovative research projects that address real-world challenges and advance knowledge.",
    general: "Support the overall mission of our institution with a contribution to our general fund."
  };

  // Initialize UI
  updateSelectedFund(selectedFund);
  if (customAmountInput) customAmountInput.style.display = "none";
  if (currencySymbol) currencySymbol.style.display = "none";
  animateCounters();
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // Event Listeners
  donationCards.forEach(card => {
    card.querySelector(".select-fund-btn").addEventListener("click", () => {
      selectedFund = card.dataset.fund;
      updateSelectedFund(selectedFund);
      document.querySelector(".donation-form-section").scrollIntoView({ behavior: "smooth" });
    });
  });

  amountOptions.forEach(option => {
    option.addEventListener("click", function() {
      amountOptions.forEach(opt => opt.classList.remove("selected"));
      this.classList.add("selected");
      selectedAmount = parseInt(this.dataset.amount, 10);
      if (customAmountInput) customAmountInput.value = "";
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener("input", function() {
      amountOptions.forEach(opt => opt.classList.remove("selected"));
      selectedAmount = parseInt(this.value, 10) || 0;
    });
  } else {
    console.error("customAmountInput element not found!");
  }

  if (donateButton) {
    donateButton.addEventListener("click", processDonation);
    console.log("Click listener attached to donateButton.");
  } else {
    console.error("Donate button element NOT FOUND!");
  }

  // --- Functions ---

  function updateSelectedFund(fund) {
    selectedFundName.textContent = fund.charAt(0).toUpperCase() + fund.slice(1) + " Fund";
    selectedFundDescription.textContent = fundDescriptions[fund] || "";
    donationCards.forEach(card => {
      card.style.borderColor = card.dataset.fund === fund ? "var(--secondary-color)" : "transparent";
    });
  }

async function processDonation() {
    console.log("processDonation() function called!");
  
    console.log("validateForm() returned:", validateForm());
    if (!validateForm()) {
      console.log("Form validation failed inside processDonation.");
      return;
    }
  
    console.log("Form validation passed.");
    showToast("Processing your donation...", "info");
    console.log("showToast called for 'Processing...'");
  
    const formData = new FormData();
    formData.append("selected_fund", selectedFund);
    formData.append("donation_amount", selectedAmount);
    formData.append("donor_name", donorNameInput.value.trim());
    formData.append("donor_email", donorEmailInput.value.trim());
    formData.append("donor_phone", donorPhoneInput.value.trim());
    formData.append("donor_message", donorMessageInput.value.trim());
    console.log("FormData created:", formData);
  
    try {
      const response = await fetch("/donation/", {
        method: "POST",
        body: formData,
      });
  
      console.log("Fetch response received:", response);
  
      const data = await response.text();
      console.log("Fetch data received:", data);
      showToast("Thank you for your donation!", "success");
      resetForm();
      window.location.href = "/payment-gateway/";
    } catch (error) {
      console.error("Donation failed:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  }

  function validateForm() {
    if (!donorNameInput.value.trim()) {
      showToast("Please enter your name.", "error");
      return false;
    }
    if (!donorEmailInput.value.trim() || !isValidEmail(donorEmailInput.value.trim())) {
      showToast("Please enter a valid email address.", "error");
      return false;
    }
    if (!donorPhoneInput.value.trim()) {
      showToast("Please enter your phone number.", "error");
      return false;
    }
    if (selectedAmount <= 0) {
      showToast("Please select a donation amount or enter a custom amount.", "error");
      return false;
    }
    return true;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function resetForm() {
    amountOptions.forEach(opt => opt.classList.remove("selected"));
    if (customAmountInput) customAmountInput.value = "";
    selectedAmount = 0;
    donorNameInput.value = "";
    donorEmailInput.value = "";
    donorPhoneInput.value = "";
    donorMessageInput.value = "";
    anonymousCheckbox.checked = false;
    recurringCheckbox.checked = false;
    if (customAmountInput) customAmountInput.style.display = "none";
    if (currencySymbol) currencySymbol.style.display = "none";
  }

  function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    toastBox.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  function animateCounters() {
    const counters = document.querySelectorAll(".counter");
    const speed = 200;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const increment = Math.ceil(target / speed);
      let count = 0;

      const updateCount = () => {
        if (count < target) {
          count += increment;
          if (count > target) {
            count = target;
          }
          counter.textContent = count.toLocaleString();
          setTimeout(updateCount, 1);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      updateCount();
    });
  }

  // Add keyframe animation for toast exit (if not already in CSS)
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
  `;
  document.head.appendChild(style);
});