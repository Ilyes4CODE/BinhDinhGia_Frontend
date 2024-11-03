document.addEventListener('DOMContentLoaded', function () {
    const brancheSelect = document.getElementById('branche');

    // Fetch branches from API
    fetch('http://127.0.0.1:8000/Registrations/All_Branches/')
        .then(response => response.json())
        .then(data => {
            // Loop through each branch and create an option element
            data.forEach(branch => {
                const option = document.createElement('option');
                option.value = branch.id;
                option.text = branch.address;  // You can display Trainer or any other field
                brancheSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching branches:', error);
        });
});
document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent the form from submitting the default way

    const form = e.target;
    const formData = new FormData(form);  // Gather all form data, including files

    // Send the form data to the backend API
    fetch('http://127.0.0.1:8000/Registrations/Create_registration/', {
      method: 'POST',
      body: formData,  // Send form data as body of the POST request
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      // Show SweetAlert with a success message and download button
      Swal.fire({
        title: 'Registration Successful!',
        text: 'Your registration has been successfully submitted.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Download Certificate',
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          downloadCertificate(data);  // Trigger certificate download if confirmed
        }
      });
    })
    .catch(error => {
      console.error('There was a problem with the registration:', error);
      Swal.fire({
        title: 'Registration Failed!',
        text: 'There was an issue with your registration. Please try again.',
        icon: 'error'
      });
    });
  });

  function downloadCertificate(data) {
    fetch('http://127.0.0.1:8000/Registrations/api/generate-certificate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)  // Send the form data as JSON to the certificate generation endpoint
    })
    .then(response => response.blob()) // Convert the response to a blob (PDF)
    .then(blob => {
      // Create a link element to download the PDF
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'certificate.pdf';  // Specify the filename for the download
      link.click();  // Trigger the download
    })
    .catch(error => console.error('Error:', error));
  }