import Swal from 'sweetalert2';

export function showSuccessAlert(message = '¡Operación exitosa!') {
  Swal.fire({
    icon: 'success',
    title: 'Éxito',
    text: message,
    confirmButtonColor: '#06b6d4',
    timer: 1800,
    showConfirmButton: false
  });
}
