 <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore-compat.js"></script>
    const appZayavki = firebase.initializeApp({
      apiKey: "AIzaSyC7dvYmljzcd59vWGRZZ5HpPL4G0q_LvlA",
      authDomain: "zayavki-my.firebaseapp.com",
      projectId: "zayavki-my"
    }, "zayavkiApp");
    const dbZayavki = appZayavki.firestore();

    async function submitApplication() {
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const messageDiv = document.getElementById('message');

      if (!name || !phone) {
        messageDiv.textContent = currentLang === 'ru' ? "Заполните все поля!" : "Барлық өрістерді толтырыңыз!";
        return;
      }

      try {
        await dbZayavki.collection("zayavki").add({
          name: name,
          phone: phone,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageDiv.textContent = currentLang === 'ru' ? "Заявка успешно отправлена!" : "Өтініш сәтті жіберілді!";
        document.getElementById('name').value = "";
        document.getElementById('phone').value = "";
      } catch (error) {
        console.error("Ошибка:", error);
        messageDiv.textContent = currentLang === 'ru' ? "Ошибка при отправке." : "Жіберу кезінде қате.";
      }
    }

    const appPosts = firebase.initializeApp({
      apiKey: "AIzaSyC6Fb896Rx_jFJ3SYUJd6EAjjcRdXYHyFY",
      authDomain: "my-posts-site.firebaseapp.com",
      projectId: "my-posts-site"
    }, "postsApp");
    const dbPosts = appPosts.firestore();

    const images = [
      'https://cdn.vox-cdn.com/thumbor/2pikPu6K3IAQ9yDs5Vsbk9ArsB0=/0x0:3000x2000/1200x628/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23954497/acastro_STK459_01.jpg',
      'https://picsum.photos/id/1025/400/200',
      'https://picsum.photos/id/1035/400/200',
      'https://picsum.photos/id/1045/400/200',
      'https://picsum.photos/id/1055/400/200',
      'https://picsum.photos/id/1065/400/200',
      'https://picsum.photos/id/1075/400/200',
      'https://cdn.vox-cdn.com/thumbor/2pikPu6K3IAQ9yDs5Vsbk9ArsB0=/0x0:3000x2000/1200x628/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23954497/acastro_STK459_01.jpg',
      'https://cdn.vox-cdn.com/thumbor/2pikPu6K3IAQ9yDs5Vsbk9ArsB0=/0x0:3000x2000/1200x628/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23954497/acastro_STK459_01.jpg',
      'https://cdn.vox-cdn.com/thumbor/2pikPu6K3IAQ9yDs5Vsbk9ArsB0=/0x0:3000x2000/1200x628/filters:focal(1500x1000:1501x1001)/cdn.vox-cdn.com/uploads/chorus_asset/file/23954497/acastro_STK459_01.jpg'
    ];

    async function loadTexts() {
      const gallery = document.getElementById('gallery');
      const snapshot = await dbPosts.collection("texts").orderBy("createdAt", "desc").get();
      const allDocs = snapshot.docs;
      const latest10 = allDocs.slice(0, 10);
      const extra = allDocs.slice(10);
      extra.forEach(doc => doc.ref.delete());

      gallery.innerHTML = "";
      for (let i = 0; i < 10; i++) {
        const text = latest10[i]?.data().text || (currentLang === 'ru' ? "Пока нет текста" : "Мәтін әлі жоқ");
        const imageUrl = images[i];
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<img src="${imageUrl}" alt="Image ${i+1}"><p>${text}</p>`;
        gallery.appendChild(div);
      }
    }

    async function submitReview() {
      const reviewerName = document.getElementById('reviewerName').value.trim();
      const reviewText = document.getElementById('reviewText').value.trim();
      const reviewMessageDiv = document.getElementById('reviewMessage');

      if (!reviewerName || !reviewText) {
        reviewMessageDiv.textContent = "Заполните все поля!";
        return;
      }

      try {
        await dbPosts.collection("reviews").add({
          name: reviewerName,
          review: reviewText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        reviewMessageDiv.textContent = "Отзыв успешно отправлен!";
        document.getElementById('reviewerName').value = "";
        document.getElementById('reviewText').value = "";
        loadReviews(); // Обновляем список отзывов
      } catch (error) {
        console.error("Ошибка:", error);
        reviewMessageDiv.textContent = "Ошибка при отправке отзыва.";
      }
    }

    async function loadReviews() {
      const reviewsList = document.getElementById('reviewsList');
      const snapshot = await dbPosts.collection("reviews").orderBy("createdAt", "desc").get();
      reviewsList.innerHTML = '';
      snapshot.docs.forEach(doc => {
        const reviewData = doc.data();
        const reviewElement = document.createElement('div');
        reviewElement.innerHTML = `<p><strong>${reviewData.name}:</strong> ${reviewData.review}</p>`;
        reviewsList.appendChild(reviewElement);
      });
    }

    loadTexts();
    loadReviews();

    let currentLang = 'ru';

    function switchLanguage(lang) {
      currentLang = lang;
      document.querySelectorAll('[data-ru]').forEach(element => {
        element.textContent = element.dataset[lang] || element.textContent;
      });
    }

    function showSection(id) {
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      document.querySelectorAll('.bottom-menu button').forEach(btn => btn.classList.remove('active'));
      document.querySelector(`.bottom-menu button[onclick="showSection('${id}')"]`).classList.add('active');
    }
