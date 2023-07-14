export const TOASTER_CSS: string = `
.notifications {
  position: fixed;
  top: 2rem;
  right: 1.5rem;
}

.notifications :where(.toast, .column) {
  display: flex;
  align-items: center;
}

.notifications .toast {
  position: relative;
  overflow: hidden;
  list-style: none;
  background-color: var(--outline-input-background-color);
  border: 1px solid;
  border-radius: .5rem;
  cursor: pointer;
  font-size: 1rem;
  height: 2.8rem;
  line-height: 2rem;
  padding: 0 2rem;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  margin-bottom: 1.5rem;
  justify-content: space-between;
  transition: all ease-in-out 0.2s;
  animation: show_toast 0.3s ease forwards;
}

.notifications .toast.hide {
  animation: hide_toast 0.3s ease forwards;
}

@keyframes show_toast {
  0% {
    transform: translateX(100%);
  }
  40% {
    transform: translateX(-5%);
  }
  80% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-10px);
  }
}

@keyframes hide_toast {
  0% {
    transform: translateX(-10px);
  }
  40% {
    transform: translateX(0%);
  }
  80% {
    transform: translateX(-5%);
  }
  100% {
    transform: translateX(calc(100% + 20px));
  }
}

@media screen and (max-width: 530px) {
  .notifications {
    width: 95%;
  }
  .notifications .toast {
    width: 100%;
    font-size: 1rem;
    margin-left: 20px;
  }
  .buttons .btn {
    margin: 0 1px;
    font-size: 1.1rem;
    padding: 8px 15px;
  }
}
`;
