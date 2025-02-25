import React from "react";

/* Страница 404 */
export const NotFound = () => {
  return (
    <>
      <main
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <section className="top-sales">
              <h1 className="display-1 fw-bold text-danger">404</h1>
              <h2 className="text-center fw-bold mb-4">Страница не найдена</h2>
              <p className="text-center mt-2 mb-4">
                Извините, такая страница не найдена! Пожалуйста, проверьте адрес
                страницы и попробуйте снова.
              </p>
              <a href="/" className="btn btn-primary btn-lg">
                Вернуться на главную страницу
              </a>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};
