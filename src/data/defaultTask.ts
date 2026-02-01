/**
 * DEFAULT TASK DATA
 * Sample data for demonstration and testing
 */

import type { TaskData } from '@/types';

export const DEFAULT_TASK_DATA: TaskData = {
  titel: 'Aufgabe 4: Chemischer Prozess mit Reaktion und Phasentrennung',
  description: 'Diese Übung behandelt die Bilanzierung eines gekoppelten Systems aus Reaktor und Phasentrenner. Der Fokus liegt auf der Berechnung von Gleichgewichtszuständen und Energiebilanzen unter Berücksichtigung von Rückführströmen (Recycle).',
  meta: {
    tags: ['Thermodynamik', 'Reaktionstechnik'],
    difficulty: 'medium',
  },
  teilaufgaben: [
    {
      frage: 'Druck $p_4$ im Phasentrenner',
      steps: [
        {
          title: 'Druck über Siedelinie bestimmen',
          origin: 'p = \\sum_{i} x_i p_{s0i}(T)',
          application: 'p_4 = x_{6A} p_{s0A}(t_4) + x_{6B} p_{s0B}(t_4)',
          explanation:
            'Wir wollen den Systemdruck im Gleichgewichtszustand 4 berechnen. Die Sättigungsdrücke p_{s0i} sind gegeben. Uns fehlen jedoch die Stoffmengenanteile der flüssigen Phase (Recyclestrom 6), x_{6A} und x_{6B}.',
        },
        {
          title: 'Stoffmengenströme über Dampfanteil und Umsatz bilanzieren',
          origin: "x = \\frac{m''}{m} \\rightarrow \\text{hier: } x''_4 = \\frac{\\dot{n}_5}{\\dot{n}_4}",
          application: '\\dot{n}_4 = \\frac{\\dot{n}_1}{x\'\'_4} = \\frac{100}{0,2} = 500 \\, \\text{kmol/h}',
          explanation:
            'Da es eine äquimolare Reaktion ist und stationär gefahren wird, muss der Produktstrom n_5 dem Eduktstrom n_1 entsprechen. Mit dem gegebenen Dampfanteil x\'\'_4 finden wir den Gesamtstrom n_4 vor dem Trenner. Jetzt müssen wir über den Umsatz U_A den Anteil der Komponente A finden.',
        },
        {
          title: 'Komponentenbilanz für Stoffmengenanteil',
          origin: 'x_{i} = \\frac{n_i}{n}',
          application: 'x_{6A} = \\frac{\\dot{n}_{2A} - \\dot{n}_{1A}}{\\dot{n}_4 - \\dot{n}_5} = 0,156',
          explanation:
            'Durch die Bilanz um den Mischer und den Trenner isolieren wir x_{6A}. Mit x_{6B} = 1 - x_{6A} haben wir alle Werte für die Siedelinie aus Schritt 1.',
        },
      ],
    },
    {
      frage: 'Wärmestrom des Reaktors Q_R',
      steps: [
        {
          title: 'Energiebilanz für den Reaktor',
          origin: '0 = \\sum \\dot{m}_i h_i + \\dot{Q} + \\dot{W}',
          application: '\\dot{Q}_R = -\\xi \\cdot \\Delta h^R',
          explanation:
            'Für den isothermen Reaktor entspricht der Wärmestrom der Reaktionswärme. Wir müssen die Umsatzvariable \\xi und die Reaktionsenthalpie \\Delta h^R bestimmen.',
        },
        {
          title: "Reaktionsenthalpie über van't Hoff",
          origin: '\\frac{d \\ln K(T)}{dT} = \\frac{\\Delta h^R}{R T^2}',
          application:
            '\\ln\\left(\\frac{K(T_R)}{K(T_0)}\\right) = -\\frac{\\Delta h^R}{R} \\left(\\frac{1}{T_R} - \\frac{1}{T_0}\\right)',
          explanation:
            'Da \\Delta h^R als konstant angenommen wird, können wir sie aus der Änderung der Gleichgewichtskonstante K zwischen 20°C und 80°C berechnen. K(80°C) erhalten wir aus den Stoffmengenanteilen x_3.',
        },
        {
          title: 'Umsatzvariable bestimmen',
          origin: '\\xi = \\frac{n_i - n_i^{(0)}}{\\nu_i}',
          application: '\\xi = \\dot{n}_{2A} - \\dot{n}_{3A}',
          explanation:
            'Mit \\xi und \\Delta h^R kann nun der Wärmestrom Q_R aus Schritt 1 berechnet werden.',
        },
      ],
    },
    {
      frage: 'Wärmestrom des Wärmeübertragers Q_{WÜ}',
      steps: [
        {
          title: 'Gesamtbilanz um Pumpe und Wärmeübertrager',
          origin: '0 = \\sum \\dot{m}_i (h_i + e_{a,i}) + \\sum \\dot{Q}_j + \\sum \\dot{W}_k',
          application: '0 = \\dot{n}_6 (h_6 - h_8) + \\dot{Q}_{WÜ} + P_{Pumpe}',
          explanation:
            'Wir suchen Q_{WÜ}. Dafür benötigen wir die Enthalpien h_6 (nach Trenner) und h_8 (Zustand 1), sowie die aufgewendete Pumpleistung P_{Pumpe}.',
        },
        {
          title: 'Pumpleistung über Wirkungsgrad',
          origin: '\\eta_{PV} = \\frac{(w_{12})^{rev}_t}{(w_{12})_t}',
          application: 'P_{Pumpe} = \\dot{n}_6 \\cdot \\frac{v_6^{il} (p_7 - p_6)}{\\eta_{PV}}',
          explanation:
            'Die Pumpe arbeitet polytrop. Wir nutzen das Modell der idealen Flüssigkeit (v = konst) für die reversible technische Arbeit.',
        },
        {
          title: 'Temperatur h_6 über Drossel (Isenthalpie)',
          origin: 'h_3 = h_4',
          application: undefined,
          explanation:
            'Die Drossel ist adiabat und leistet keine Arbeit, daher bleibt die Enthalpie gleich. Da h_4 im Zweiphasengebiet liegt, berechnen wir die Temperatur T_4, die gleich T_6 ist. Mit T_6 und T_8 können wir die Enthalpiedifferenz in der Bilanz aus Schritt 1 einsetzen.',
        },
      ],
    },
  ],
};
