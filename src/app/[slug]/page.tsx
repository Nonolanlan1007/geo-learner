"use client"

import styles from "./page.module.css";
import {useMemo, useState} from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import {useRouter} from "next/navigation";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const router = useRouter()

  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  /*
   * 0 → En attente d'une réponse de l'API
   * 1 → En attente d'une réponse de la part du joueur
   * 2 → L'utilisateur a renvoyé une mauvaise réponse. En attente d'une action de sa part
   * 3 → L'utilisateur a renvoyé une réponse correcte. En attente d'une action de sa part
   */
  const [state, setState] = useState(0)
  const [currentCityState, setCurrentCity] = useState<any | null>(null)
  const [entriesState, setEntries] = useState<any[]>([])
  const [usedEntriesState, setUsedEntries] = useState<any[]>([])

  let currentCity: any | null = null
  let entries: any[] = []


  const nextCity = () => {
    if (currentCityState) {
      setEntries(entriesState.filter(x => x.city !== currentCityState.city))
      usedEntriesState.push(currentCityState)
    }
    setCurrentCity(entriesState[Math.floor(Math.random() * entriesState.length)])
    setState(1)
  }

  const handleSubmit = (formData: FormData) => {
    const answer = formData.get("answers")

    if (answer === currentCityState.city) {
      setCurrentCity({
        ok: true,
        ...currentCityState
      })
      setState(3)
    }
    else setState(2)
  }

  const { data, error, isLoading} = useSWR(`/api/tables/${slug}`, (...args) => fetch(...args).then(res => res.json()))

  if (error) return router.push("/")
  if (!isLoading && state === 0) {
    entries = data
    setEntries(data)
    currentCity = entries[Math.floor(Math.random() * entries.length)]
    setCurrentCity(currentCity)
    setState(1)
  }


  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Quelle est cette ville</h1>
      <h3>Score : {usedEntriesState.filter(x => x.ok).length}/{usedEntriesState && entriesState ? usedEntriesState.length + entriesState.length : 0}</h3>
      {
        state === 1 && currentCityState ? (
          <>
            <Map position={[currentCityState.lat, currentCityState.lng]} />
            <h3>Réponse :</h3>
            <form className={styles.form} action={handleSubmit} name={"form"} id={"form"}>
              <select className={styles.select} name={"answers"} id={"answers"} required form={"form"}>
                <option value="">--Sélectionner une ville--</option>
                {
                  entriesState.map(entry => {
                    return (
                      <>
                        <option key={`${entry.lat},${entry.lng}`}>{entry.city}</option>
                      </>
                    )
                  })
                }
              </select>
              <input type={"submit"} value={"Vérifier"} />
            </form>
          </>
        ) : state === 2 || state === 3 ? (
            <>
              <Map position={[currentCityState.lat, currentCityState.lng]} tooltip={currentCityState.city} />
              <h3>{ state === 2 ? "Mauvaise réponse 😭" : state === 3 ? "Bonne réponse 🎉" : "" }</h3>
              <form className={styles.form} action={nextCity} name={"formNext"} id={"formNext"}>
                <input type={"submit"} value={"Suivant"} />
              </form>
            </>
          ) : (
          <div className={styles.loader}>
            <span className={styles.loading}/>
            <h2 className={styles.title}>[{state}] Chargement en cours...</h2>
          </div>
        )
      }
    </main>
  );
}
