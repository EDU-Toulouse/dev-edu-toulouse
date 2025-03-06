"use client";

import { useState } from "react";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Trophy,
  Cpu,
  ChevronDown,
  Twitch,
} from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function Home() {
  const [showMore, setShowMore] = useState(false);

  const nextEventDate = "20-23 Mars 2025";
  const location = "Salle des fêtes de Pechbonnieu";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent"
        >
          <Badge className="mb-4 px-3 py-1 text-sm bg-primary/10 text-primary">
            Prochaine LAN : {nextEventDate}
          </Badge>
        </motion.div>

        <div className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          <VerticalCutReveal
            splitBy="characters"
            staggerDuration={0.025}
            staggerFrom="first"
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 21,
              delay: 0.5,
            }}
          >
            {"Prêt à nous montrer ce que tu vaux ?"}
          </VerticalCutReveal>
        </div>

        <div className="text-muted-foreground text-xl md:text-2xl mb-8">
          <VerticalCutReveal
            splitBy="characters"
            staggerDuration={0.025}
            staggerFrom="last"
            reverse={true}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 21,
              delay: 1.5,
            }}
          >
            {"Viens nous rejoindre à notre prochaine LAN !"}
          </VerticalCutReveal>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button size="lg" className="group">
            Réserver ma place
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowMore(!showMore)}
          >
            En savoir plus
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                showMore ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        <motion.div
          className="absolute bottom-8 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </motion.div>
        <div className="pointer-events-none">
          <FlickeringGrid
            className="z-0 absolute inset-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={0.1}
          />
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Notre prochaine LAN
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Rejoignez-nous pour un week-end de compétition, de fun et de
            networking entre passionnés de jeux vidéo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Quand et où</CardTitle>
              <CardDescription>Informations pratiques</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{nextEventDate}</p>
              <p className="mt-2">{location}</p>
              <p className="mt-4">
                Ouverture des portes à 10h le premier jour. Apportez votre
                matériel !
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="group">
                Plan d&apos;accès{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Tournois</CardTitle>
              <CardDescription>Compétitions et prix</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">League of Legends</span> - 5v5
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">CS2</span> - 5v5
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Rocket League</span> - 3v3
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Valorant</span> - 5v5
                </li>
              </ul>
              <p className="mt-4">Plus de 2000€ de cashprize à gagner !</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="group">
                Règlements{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Cpu className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Équipement</CardTitle>
              <CardDescription>Ce que vous devez apporter</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>PC/Laptop avec vos jeux installés</li>
                <li>Écran, clavier, souris, casque</li>
                <li>Multiprise et câble ethernet (5m min.)</li>
                <li>Carte d&apos;identité pour l&apos;inscription</li>
              </ul>
              <p className="mt-4">
                Connexion internet haut débit et prises électriques fournies.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="group">
                FAQ{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Tabs Section - Past Events */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Nos événements passés
          </h2>

          <Tabs defaultValue="lan2024" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="lan2024">Hiver 2024</TabsTrigger>
              <TabsTrigger value="lan2023">Été 2023</TabsTrigger>
              <TabsTrigger value="lan2022">Hiver 2022</TabsTrigger>
            </TabsList>

            <TabsContent value="lan2024" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>LAN Party Hiver 2024</CardTitle>
                  <CardDescription>
                    15-18 Février 2024 - 120 participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Tournois</h4>
                      <ul className="space-y-2">
                        <li>
                          CS2 - Équipe &quot;HeadShot Heroes&quot; (Vainqueurs)
                        </li>
                        <li>
                          Valorant - Équipe &quot;Pixel Precision&quot;
                          (Vainqueurs)
                        </li>
                        <li>
                          League of Legends - Équipe &quot;Nexus Guardians&quot;
                          (Vainqueurs)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Galerie</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="aspect-square bg-secondary rounded-md"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Voir toutes les photos</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="lan2023">
              <Card>
                <CardHeader>
                  <CardTitle>LAN Party Été 2023</CardTitle>
                  <CardDescription>
                    24-27 Août 2023 - 100 participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Notre LAN d&apos;été avec des tournois Fortnite, Apex
                    Legends et Rocket League.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button>Voir les résultats</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="lan2022">
              <Card>
                <CardHeader>
                  <CardTitle>LAN Party Hiver 2022</CardTitle>
                  <CardDescription>
                    10-13 Février 2022 - 80 participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Notre première grande LAN avec des tournois CSGO et League
                    of Legends.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button>Voir les résultats</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez notre communauté
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Notre association ne s&apos;arrête pas aux LANs. Rejoignez notre
            communauté en ligne pour participer à des tournois hebdomadaires,
            trouver des coéquipiers et rester informé de nos prochains
            événements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="mr-2 h-5 w-5"
                viewBox="0 0 16 16"
              >
                <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
              </svg>
              Discord
            </Button>
            <Button size="lg" variant="outline">
              <Twitch className="mr-2 h-5 w-5" />
              Twitch
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à rejoindre la prochaine LAN ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Places limitées à 150 participants. Réservez dès maintenant pour
            garantir votre place !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group">
              Réserver ma place
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
