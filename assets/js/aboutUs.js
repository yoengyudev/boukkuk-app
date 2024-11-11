document.addEventListener("DOMContentLoaded", function () {
    //swipper
    var swiper = new Swiper(".teamSwiper", {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      parallax: true,
      speed: 600,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
    // Scroll to top button
    const scrollToTopBtn = document.getElementById("scrollToTop");

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 100) {
        scrollToTopBtn.style.display = "block";
      } else {
        scrollToTopBtn.style.display = "none";
      }
    });

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    // Timeline animation
    const timelineItems = document.querySelectorAll(".timeline-item");
    let activeIndex = 0;

    function activateTimelineItem(index) {
      timelineItems.forEach((item, i) => {
        if (i === index) {
          item.querySelector(".timeline-content").style.transform =
            "scale(1.03)";
          item.querySelector("h4").style.transform = "scale(1.1)";
        } else {
          item.querySelector(".timeline-content").style.transform =
            "scale(1)";
          item.querySelector("h4").style.transform = "scale(1)";
        }
      });
    }

    setInterval(() => {
      activeIndex = (activeIndex + 1) % timelineItems.length;
      activateTimelineItem(activeIndex);
    }, 3000);

    // Stats counter animation
    const stats = document.querySelectorAll("#stats .card-title");
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const value = parseInt(target.textContent);
          let current = 0;
          const increment = value / 50;
          const timer = setInterval(() => {
            current += increment;
            target.textContent =
              Math.round(current) +
              (target.textContent.includes("+") ? "+" : "");
            if (current >= value) {
              clearInterval(timer);
              target.textContent =
                value + (target.textContent.includes("+") ? "+" : "");
            }
          }, 20);
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    stats.forEach((stat) => observer.observe(stat));
  });