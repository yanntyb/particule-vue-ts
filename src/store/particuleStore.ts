import { defineStore } from "pinia";
import { Ref, ref, watch } from "vue";

export interface ParticulePosition {
  x: number;
  y: number;
}

export interface Particule {
  id: number;
  definition: {
    currentPosition: ParticulePosition;
    speed: number;
    color: string;
    width: number;
    height: number;
    moveEveryMs: number;
    canMove: boolean;
  };
  events?: {
    onMove?: () => void;
    onMoveFinish?: () => void;
  };
  nextPosition: ParticulePosition[];
}

const moveParticulePosition = (
  particule: Ref<Particule>,
  newPosition: ParticulePosition
) => {
  if (particule.value.events?.onMove) {
    particule.value.events.onMove();
  }
  particule.value.definition.currentPosition.x = newPosition.x;
  particule.value.definition.currentPosition.y = newPosition.y;
};

export const useParticuleStore = defineStore("particules", () => {
  const particules: Ref<Ref<Particule>[]> = ref([]);
  const createdParticules = ref<number[]>([]);

  const getParticule = (particuleId: number): Ref<Particule> | undefined => {
    if (typeof particules.value === "undefined") {
      return undefined;
    }

    return particules.value.find(
      (particule: Ref<Particule>) => particule.value.id === particuleId
    );
  };

  const getAllParticules = (): Ref<Ref<Particule>[]> => {
    return particules;
  };

  const addParticule = (particule: Particule): Ref<Particule> => {
    particule.id = particule.id ?? particules.value.length;
    const particuleRef = ref(particule);

    particules.value.push(particuleRef);

    return particuleRef;
  };

  const moveParticule = (particuleId: number) => {
    const particule = getParticule(particuleId);

    if (!particule) {
      return;
    }

    // La particule ne peut pas bouger
    if (!particule.value.definition.canMove) {
      return;
    }

    const latestPosition = particule.value.nextPosition.find(() => true);

    // La particule n'a pas de destinations
    if (!latestPosition) {
      return;
    }

    const dx = latestPosition.x - particule.value.definition.currentPosition.x;
    const dy = latestPosition.y - particule.value.definition.currentPosition.y;
    const stepX = dx > 0 ? 1 : -1;
    const stepY = dy > 0 ? 1 : -1;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    const steps = Math.max(absDx, absDy);
    const stepSize = particule.value.definition.speed * 10;

    const distanceThreshold = stepSize + 10; // Seuil de distance

    const distance = Math.sqrt(
      Math.pow(
        latestPosition.x - particule.value.definition.currentPosition.x,
        2
      ) +
        Math.pow(
          latestPosition.y - particule.value.definition.currentPosition.y,
          2
        )
    );

    // La particule est arrivée à destination
    if (distance <= distanceThreshold) {
      particule.value.nextPosition.shift();

      if (particule.value.events?.onMoveFinish) {
        particule.value.events.onMoveFinish();
      }

      return;
    }

    const stepPosition = {
      x:
        particule.value.definition.currentPosition.x +
        (stepX * stepSize * absDx) / steps,
      y:
        particule.value.definition.currentPosition.y +
        (stepY * stepSize * absDy) / steps,
    };

    moveParticulePosition(particule, stepPosition);
  };

  // Callback appelé à chaque ajout de particule est ajouté dans le store
  const onParticuleAdded = (callback: (particule?: Ref<Particule>) => void) => {
    return watch(
      () => particules,
      (newParticules: Ref<Ref<Particule>[]>) => {
        // Récupère les ids des particules n'ayant jamais été ajoutées
        const addedParticules: number[] = newParticules.value
          .map((newParticule: Ref<Particule>): number | false => {
            if (createdParticules.value.includes(newParticule.value.id)) {
              return false;
            }
            return newParticule.value.id;
          })
          .filter((exist: number | false) => exist !== false) as number[];

        if (!addedParticules.length) {
          return;
        }

        // Ajoute les ids des particules nouvellement ajoutées au store pour ne plus les traiter
        createdParticules.value.push(...addedParticules);

        // Appelle le callback pour chaque particule nouvellement ajoutée
        addedParticules.forEach((particuleId: number) => {
          const particule = getParticule(particuleId);
          callback(particule);
        });
      },
      { deep: true }
    );
  };

  return {
    getParticule,
    addParticule,
    moveParticule,
    getAllParticules,
    onParticuleAdded,
  };
});
