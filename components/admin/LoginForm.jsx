"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Ear,
  LockKeyhole,
} from "lucide-react";

export default function LoginForm() {
  const router =
    useRouter();

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function submit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/admin/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                password,
              }),
          }
        );

      const data =
        await response
          .json()
          .catch(
            () => ({})
          );

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Giriş yapılamadı."
        );
      }

      router.replace(
        "/admin"
      );

      router.refresh();
    } catch (err) {
      setError(
        err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">

      <section className="admin-login-card">

        <div className="admin-login-logo">

          <span>
            <Ear size={30} />
          </span>

          <div>
            <strong>
              DuyAnt
            </strong>

            <small>
              İşitme Cihazları
            </small>
          </div>

        </div>


        <div className="admin-login-copy">

          <span className="admin-login-icon">
            <LockKeyhole
              size={22}
            />
          </span>

          <h1>
            Yönetim Paneli
          </h1>

          <p>
            Hasta, tamir ve stok
            kayıtlarını yönetmek
            için giriş yapın.
          </p>

        </div>


        <form
          onSubmit={submit}
          className="admin-login-form"
        >

          <label
            htmlFor="admin-password"
          >
            Admin Şifresi
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={
              (event) =>
                setPassword(
                  event.target.value
                )
            }
            placeholder="Şifrenizi girin"
            autoComplete="current-password"
            required
          />


          {error && (
            <div className="admin-form-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Giriş yapılıyor..."
              : "Giriş Yap"}
          </button>

        </form>

      </section>

    </main>
  );
}